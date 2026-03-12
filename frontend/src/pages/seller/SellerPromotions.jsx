import { useState } from 'react';

const SellerPromotions = () => {
  const [promotions, setPromotions] = useState([
    { id: 1, code: 'SAVE10', discount: '10%', status: 'Active', usage: 45, expiry: '2024-12-31' },
    { id: 2, code: 'FESTIVE50', discount: '₹50', status: 'Expired', usage: 120, expiry: '2023-11-01' }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: '', discount: '', expiry: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    setPromotions([
      { id: Date.now(), ...newPromo, status: 'Active', usage: 0 },
      ...promotions
    ]);
    setShowAdd(false);
    setNewPromo({ code: '', discount: '', expiry: '' });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Promotions & Coupons</h1>
          <p className="text-text-secondary">Create and manage discount codes for your customers.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-dark-pink hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          {showAdd ? 'Cancel' : 'Create Promotion'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#111111] p-6 rounded-2xl border border-[#222]">
          <h2 className="text-xl font-bold mb-4">New Discount Code</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Coupon Code</label>
              <input type="text" required value={newPromo.code} onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-dark-pink" placeholder="e.g. SUMMER20" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Discount Amount/Percent</label>
              <input type="text" required value={newPromo.discount} onChange={(e) => setNewPromo({...newPromo, discount: e.target.value})} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-dark-pink" placeholder="e.g. 20% or ₹100" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Expiry Date</label>
              <input type="date" required value={newPromo.expiry} onChange={(e) => setNewPromo({...newPromo, expiry: e.target.value})} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-white outline-none focus:border-dark-pink" />
            </div>
            <div className="md:col-span-3 mt-2">
              <button type="submit" className="bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-200">
                Activate Promotion
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#111111] rounded-2xl border border-[#222] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1a1a1a] text-text-secondary text-sm">
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Usage</th>
              <th className="px-6 py-4 font-medium">Expiry</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {promotions.map((promo) => (
              <tr key={promo.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-dark-pink bg-dark-pink/10 px-2 py-1 rounded">{promo.code}</span>
                </td>
                <td className="px-6 py-4 font-medium">{promo.discount}</td>
                <td className="px-6 py-4 text-text-secondary">{promo.usage} uses</td>
                <td className="px-6 py-4 text-sm">{promo.expiry}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${promo.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-[#333] text-text-secondary'}`}>
                    {promo.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerPromotions;
