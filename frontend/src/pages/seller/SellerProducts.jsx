import { useState, useEffect } from 'react';
import useSellerAuthStore from '../../stores/sellerAuthStore';
import api from '../../api/axios';

const SellerProducts = () => {
  const { seller, selectedStoreId } = useSellerAuthStore();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    Item_Name: '',
    Price: '',
    Stock_Available: '',
    Category: '',
    Sub_Category: '',
    Unit_Size: ''
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      if (!selectedStoreId) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      const { data } = await api.get(`/seller/products?store_id=${selectedStoreId}`, {
        headers: { 'x-seller-id': seller?.id }
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (seller || selectedStoreId) fetchProducts();
  }, [seller, selectedStoreId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/seller/products', formData, {
        headers: { 'x-seller-id': seller.id }
      });
      setShowAddForm(false);
      setFormData({ Item_Name: '', Price: '', Stock_Available: '', Category: '', Sub_Category: '', Unit_Size: '' });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/seller/products/${itemId}`, {
        headers: { 'x-seller-id': seller.id }
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products Management</h1>
          <p className="text-text-secondary">View and manage your catalog.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-dark-pink hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          {showAddForm ? 'Cancel' : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-[#111111] p-6 rounded-2xl border border-[#222]">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Product Name</label>
              <input type="text" name="Item_Name" required value={formData.Item_Name} onChange={handleInputChange} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white focus:border-dark-pink outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Price (₹)</label>
              <input type="number" name="Price" required value={formData.Price} onChange={handleInputChange} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white focus:border-dark-pink outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Stock</label>
              <input type="number" name="Stock_Available" required value={formData.Stock_Available} onChange={handleInputChange} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white focus:border-dark-pink outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Category</label>
              <input type="text" name="Category" value={formData.Category} onChange={handleInputChange} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white focus:border-dark-pink outline-none" placeholder="e.g. Snacks" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Sub Category</label>
              <input type="text" name="Sub_Category" value={formData.Sub_Category} onChange={handleInputChange} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white focus:border-dark-pink outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Unit Size</label>
              <input type="text" name="Unit_Size" value={formData.Unit_Size} onChange={handleInputChange} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white focus:border-dark-pink outline-none" placeholder="e.g. 250g" />
            </div>
            <div className="md:col-span-2 mt-2">
              <button type="submit" className="bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#111111] rounded-2xl border border-[#222] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">No products found. Add your first product!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1a1a1a] text-text-secondary text-sm">
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {products.map((product) => (
                  <tr key={product.Item_ID} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      {product.Image_URL ? (
                        <img src={product.Image_URL} alt={product.Item_Name} className="w-12 h-12 object-cover rounded bg-[#222]" />
                      ) : (
                        <div className="w-12 h-12 bg-[#222] rounded flex items-center justify-center text-xs text-text-secondary">No img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{product.Item_Name}</td>
                    <td className="px-6 py-4 text-text-secondary">{product.Category}</td>
                    <td className="px-6 py-4 font-medium">₹{product.Price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${product.Stock_Available > 10 ? 'bg-green-500/10 text-green-500' : 
                          product.Stock_Available > 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                        {product.Stock_Available} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(product.Item_ID)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
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

export default SellerProducts;
