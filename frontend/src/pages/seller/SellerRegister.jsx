import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSellerAuthStore from '../../stores/sellerAuthStore';

const SellerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
    brandName: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useSellerAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register(formData);
    
    setIsLoading(false);
    
    if (result.success) {
      navigate('/seller/dashboard');
    } else {
      setError(result.error || 'Failed to register');
    }
  };

  return (
    <div className="bg-[#111111] p-8 rounded-2xl border border-[#222] shadow-2xl relative w-full max-w-lg mx-auto">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dark-pink to-pink-500"></div>
      
      <h2 className="text-2xl font-bold mb-2 text-center">Become a Seller</h2>
      <p className="text-text-secondary text-sm text-center mb-6">Create your store on Syncora</p>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Your Name</label>
            <input 
              type="text" 
              name="name"
              className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-dark-pink transition-colors"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-dark-pink transition-colors"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
          <input 
            type="password" 
            name="password"
            className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-dark-pink transition-colors"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="border-t border-[#333] my-4 pt-4">
          <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-text-secondary">Store Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Brand Name</label>
              <input 
                type="text" 
                name="brandName"
                className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-dark-pink transition-colors"
                value={formData.brandName}
                onChange={handleChange}
                required
                placeholder="e.g. Manohar Dairy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Outlet Name</label>
              <input 
                type="text" 
                name="storeName"
                className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-dark-pink transition-colors"
                value={formData.storeName}
                onChange={handleChange}
                required
                placeholder="e.g. Main Branch"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Store Address</label>
            <input 
              type="text" 
              name="address"
              className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-dark-pink transition-colors"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-dark-pink hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-dark-pink/20 transition-all disabled:opacity-50 mt-6"
        >
          {isLoading ? 'Creating Account...' : 'Register Store'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-text-secondary">
        Already have a seller account?{' '}
        <Link to="/seller/login" className="text-dark-pink hover:text-pink-400 font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SellerRegister;
