import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useSellerAuthStore from '../../stores/sellerAuthStore';
import api from '../../api/axios';

const SellerDashboard = () => {
  const { seller, store, sellerStore, selectedStoreId } = useSellerAuthStore();
  const activeStore = sellerStore || store;
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, order: null });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        if (!selectedStoreId) {
          setStats(null);
          setIsLoading(false);
          return;
        }

        const { data } = await api.get(`/seller/dashboard?store_id=${selectedStoreId}`, {
          headers: {
            'x-seller-id': seller?.id
          }
        });
        
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (seller || selectedStoreId) {
      fetchDashboardStats();
    }
  }, [seller, selectedStoreId]);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!selectedStoreId) return;

    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('[socket] Connected to server in Dashboard:', socketRef.current.id);
    });

    socketRef.current.on('newOrder', (order) => {
      // Allow demo mode selection OR default seller store
      const activeStoreId = selectedStoreId || seller?.storeId;

      if (order.store_id !== activeStoreId) {
        return;
      }

      setNotification({
        show: true,
        order
      });

      setTimeout(() => {
        setNotification({ show: false });
      }, 5000);

      try {
        const audio = new Audio("/notification.mp3");
        audio.play().catch(e => console.log('Audio playback failed', e));
      } catch (e) {
        console.log('Audio creation failed', e);
      }

      setStats(prevStats => {
        if (!prevStats) return prevStats;
        
        // Check for duplicate
        if (prevStats.recentOrders.some(o => o.orderId === order.orderId)) return prevStats;

        return {
          ...prevStats,
          revenue: prevStats.revenue + order.total,
          ordersCount: prevStats.ordersCount + 1,
          pendingOrders: prevStats.pendingOrders + 1,
          recentOrders: [order, ...prevStats.recentOrders].slice(0, 5)
        };
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedStoreId]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-4 border-[#333] border-t-dark-pink animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {seller?.name}</h1>
        <p className="text-text-secondary">Here's what's happening at {activeStore?.Name} today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats?.revenue || 0}`} 
          trend="+12%" 
          isPositive={true}
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
        <StatCard 
          title="Pending Orders" 
          value={stats?.pendingOrders || 0} 
          trend="Needs attention"
          isWarning={stats?.pendingOrders > 0}
          icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats?.lowStock || 0} 
          trend={stats?.outOfStock > 0 ? `${stats?.outOfStock} out of stock` : 'All good'}
          isDanger={stats?.outOfStock > 0}
          isWarning={stats?.lowStock > 0 && stats?.outOfStock === 0}
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.ordersCount || 0} 
          trend="+5%"
          isPositive={true}
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-[#111111] rounded-2xl border border-[#222] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#222] flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <button className="text-sm text-dark-pink hover:text-pink-400 font-medium">View All</button>
        </div>
        
        {stats?.recentOrders?.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            No recent orders.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1a1a1a] text-text-secondary text-sm">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order.orderId} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">{order.orderId}</td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase
                        ${order.type === 'delivery' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}
                      `}>
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase
                        ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                          order.status === 'ready' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-green-500/10 text-green-500'}
                      `}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {notification.show && notification.order && (
        <div 
          className="order-toast bg-[#111111] border border-dark-pink p-4 rounded-xl shadow-2xl z-50 text-white"
          style={{ position: 'fixed', top: '20px', right: '20px' }}
        >
          <div className="font-bold mb-1">🔔 New Order Received</div>
          <div className="text-sm font-mono mb-1">Order #{notification.order.orderId}</div>
          {notification.order.items && notification.order.items.length > 0 && (
            <div className="text-sm text-text-secondary">
              {notification.order.items[0].name} ×{notification.order.items[0].quantity}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper component for stats
const StatCard = ({ title, value, trend, isPositive, isWarning, isDanger, icon }) => (
  <div className="bg-[#111111] p-6 rounded-2xl border border-[#222] relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={icon} />
      </svg>
    </div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-secondary font-medium">{title}</h3>
        <div className={`p-2 rounded-lg 
          ${isPositive ? 'bg-green-500/10 text-green-500' : 
            isDanger ? 'bg-red-500/10 text-red-500' :
            isWarning ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#222] text-white'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className={`text-sm font-medium
        ${isPositive ? 'text-green-500' : 
          isDanger ? 'text-red-500' :
          isWarning ? 'text-yellow-500' : 'text-text-secondary'}
      `}>
        {trend}
      </div>
    </div>
  </div>
);

export default SellerDashboard;
