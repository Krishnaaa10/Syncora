import React from 'react';
import useSellerAuthStore from '../../stores/sellerAuthStore';

const SellerProfile = () => {
  const seller = useSellerAuthStore(state => state.seller);

  if (!seller) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Seller Profile</h1>

      <div className="bg-[#111111] border border-[#222] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-medium mb-4 text-white">Personal Information</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-text-secondary">Name</label>
            <input
              type="text"
              readOnly
              value={seller.name || ''}
              className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-2 text-white outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm text-text-secondary">Email</label>
            <input
              type="email"
              readOnly
              value={seller.email || ''}
              className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-2 text-white outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#222] rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4 text-white">Profile Settings</h2>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-[#222] hover:bg-[#333] transition-colors text-left">
            <span className="text-white font-medium">Change Password</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-[#222] hover:bg-[#333] transition-colors text-left">
            <span className="text-white font-medium">Notification Preferences</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-[#222] hover:bg-[#333] transition-colors text-left">
            <span className="text-white font-medium">Store Settings</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-[#222] hover:bg-[#333] transition-colors text-left">
            <span className="text-white font-medium">API Keys</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
