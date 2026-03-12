import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useSellerAuthStore from '../../stores/sellerAuthStore';
import { stores } from '../../data/storeData';

// Group stores by brand
const brands = {};
stores.forEach(store => {
  if (!brands[store.Brand]) {
    brands[store.Brand] = [];
  }
  brands[store.Brand].push(store);
});

const SellerLayout = () => {
  const { seller, store, sellerStore, selectedStoreId, selectedBrand, setSelectedBrand, setSelectedStore, isAuthenticated, isAuthChecking, logout, initialize, isDemoMode, exitDemoMode } = useSellerAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDemoStores, setShowDemoStores] = useState(false);
  
  const activeStore = sellerStore || store;

  const handleLogoClick = () => {
    if (isDemoMode) {
      exitDemoMode();
    }
    navigate("/seller/dashboard");
  };

  useEffect(() => {
    initialize();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/seller/logout');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Products', path: '/seller/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Inventory', path: '/seller/inventory', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Orders', path: '/seller/orders', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Promotions', path: '/seller/promotions', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  ];



  // Render minimal layout for login/register/logout pages
  if (['/seller/login', '/seller/register', '/seller/logout'].includes(location.pathname)) {
    return (
      <div className="min-h-screen bg-near-black text-white relative overflow-hidden flex flex-col items-center justify-center p-4">
        {/* Background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-dark-pink/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-md z-10">
          {location.pathname !== '/seller/logout' && (
            <div className="text-center mb-8">
              <div onClick={handleLogoClick} className="inline-block cursor-pointer" title="Return to your store">
                <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-dark-pink to-pink-500">
                  Syncora
                </span>
                <span className="text-sm font-medium text-text-secondary ml-2 uppercase tracking-widest block mt-1">
                  Seller Portal
                </span>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    );
  }



  // Dashboard layout
  return (
    <div className="min-h-screen bg-near-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#222] flex flex-col hidden md:flex">
        <div className="p-6 border-b border-[#222]">
          <div className="flex items-center justify-between">
            <div onClick={handleLogoClick} className="flex flex-col cursor-pointer" title="Return to your store">
              <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-dark-pink to-pink-500">
                Syncora
              </span>
              <span className="text-xs font-medium text-text-secondary uppercase tracking-widest mt-1">
                Seller Portal
              </span>
            </div>
            {isDemoMode && (
              <button
                onClick={exitDemoMode}
                className="ml-3 text-sm text-pink-400 hover:text-pink-300"
              >
                Exit Demo Mode
              </button>
            )}
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-dark-pink/10 text-dark-pink border border-dark-pink/20' 
                    : 'text-text-secondary hover:bg-[#222] hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}

          {/* Demo Store Switcher */}
          <div className="pt-4 mt-4 border-t border-[#222]">
            <button
              onClick={() => setShowDemoStores(!showDemoStores)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-text-secondary hover:bg-[#222] hover:text-white"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">Demo Seller</span>
              </div>
              <svg 
                className={`w-4 h-4 transition-transform ${showDemoStores ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDemoStores && (
              <div className="mt-2 space-y-2">
                {Object.keys(brands).map((brand) => (
                  <div key={brand} className="space-y-1">
                    <button
                      onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                      className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${
                        selectedBrand === brand ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-[#222]'
                      }`}
                    >
                      <span>{brand}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${selectedBrand === brand ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {selectedBrand === brand && (
                      <div className="pl-4 space-y-1">
                        {brands[brand].map((s) => (
                          <button
                            key={s.Store_ID}
                            onClick={() => setSelectedStore(s)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${
                              selectedStoreId === s.Store_ID
                                ? 'bg-pink-600/20 border border-pink-500 text-white'
                                : 'border border-transparent hover:border-gray-800 hover:bg-gray-800 text-gray-300'
                            }`}
                          >
                            <span className="truncate">{s.Name.replace(`${brand} - `, '').trim() || s.Name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
        
        <div className="p-4 border-t border-[#222]">
          <div className="flex items-center mb-4">
            <div 
              onClick={() => navigate("/seller/profile")}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#333] to-[#111] border border-[#333] flex items-center justify-center text-lg font-bold cursor-pointer hover:border-pink-500 transition-colors"
            >
              {seller?.name?.charAt(0) || 'S'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{seller?.name}</p>
              <p className="text-xs text-text-secondary truncate">{activeStore?.Name || 'No Store'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-[#222] rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-[#111111] border-b border-[#222] flex items-center justify-between px-4">
          <div onClick={handleLogoClick} className="text-xl font-black text-dark-pink cursor-pointer" title="Return to your store">Syncora Seller</div>
          <button className="text-text-secondary p-2">
            {/* simple hamburger menu mock */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-auto bg-near-black flex flex-col">
          {/* Store Badge */}
          {activeStore && (
            <div className="bg-[#111111] border-b border-[#222] py-2 px-6 flex items-center justify-center sm:justify-end shrink-0 hidden md:flex">
              <span className="text-sm font-medium text-text-secondary flex items-center bg-[#222] rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Current Store: <span className="text-white ml-1">{activeStore.Name}</span>
              </span>
            </div>
          )}
          
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
