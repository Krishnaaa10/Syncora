import { useState, useEffect } from 'react';
import useSellerAuthStore from '../../stores/sellerAuthStore';
import api from '../../api/axios';

const SellerInventory = () => {
  const { seller, selectedStoreId } = useSellerAuthStore();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProducts = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      if (!selectedStoreId) {
        setProducts([]);
        if (!silent) setIsLoading(false);
        return;
      }
      const { data } = await api.get(`/seller/products?store_id=${selectedStoreId}`, {
        headers: { 'x-seller-id': seller?.id }
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (seller || selectedStoreId) {
      fetchProducts();
      // Implement polling to fetch real-time stock updates instantly when customers order
      const intervalId = setInterval(() => {
        fetchProducts(true);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [seller, selectedStoreId]);

  const handleStockUpdate = async (itemId, currentStock, change) => {
    const newStock = Math.max(0, currentStock + change);
    if (newStock === currentStock) return;
    
    setUpdatingId(itemId);
    try {
      await api.put(`/seller/products/${itemId}`, { Stock_Available: newStock }, {
        headers: { 'x-seller-id': seller.id }
      });
      
      setProducts(products.map(p => 
        p.Item_ID === itemId ? { ...p, Stock_Available: newStock } : p
      ));
    } catch (err) {
      console.error(err);
      alert('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-text-secondary">Quickly adjust stock levels for your products.</p>
      </div>

      <div className="bg-[#111111] rounded-2xl border border-[#222] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary">Loading inventory...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">No products found. Add products first.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1a1a1a] text-text-secondary text-sm">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Current Stock</th>
                  <th className="px-6 py-4 font-medium">Quick Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {products.map((product) => (
                  <tr key={product.Item_ID} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{product.Item_Name}</div>
                      <div className="text-xs text-text-secondary mt-1">ID: {product.Item_ID} | Size: {product.Unit_Size}</div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">₹{product.Price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-lg font-bold
                        ${product.Stock_Available > 10 ? 'text-green-500' : 
                          product.Stock_Available > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {product.Stock_Available}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleStockUpdate(product.Item_ID, product.Stock_Available, -1)}
                          disabled={updatingId === product.Item_ID || product.Stock_Available <= 0}
                          className="w-10 h-10 rounded-lg bg-[#222] hover:bg-[#333] border border-[#333] flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          -1
                        </button>
                        <button 
                          onClick={() => handleStockUpdate(product.Item_ID, product.Stock_Available, 1)}
                          disabled={updatingId === product.Item_ID}
                          className="w-10 h-10 rounded-lg bg-[#222] hover:bg-[#333] border border-[#333] flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          +1
                        </button>
                        <button 
                          onClick={() => handleStockUpdate(product.Item_ID, product.Stock_Available, 10)}
                          disabled={updatingId === product.Item_ID}
                          className="w-10 h-10 rounded-lg bg-[#222] hover:bg-[#333] border border-[#333] flex items-center justify-center transition-colors text-xs font-bold disabled:opacity-50"
                        >
                          +10
                        </button>
                        {updatingId === product.Item_ID && (
                          <span className="text-xs text-text-secondary animate-pulse ml-2">Updating...</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInventory;
