import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useSellerAuthStore from '../../stores/sellerAuthStore';
import api from '../../api/axios';

const SellerOrders = () => {
  const { seller, selectedStoreId } = useSellerAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, order: null });

  const fetchOrders = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      if (!selectedStoreId) {
        setOrders([]);
        return;
      }
      const { data } = await api.get(`/seller/orders?store_id=${selectedStoreId}`, {
        headers: { 'x-seller-id': seller?.id }
      });
      // Sort newest first
      setOrders(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (seller || selectedStoreId) {
      fetchOrders();
      const interval = setInterval(() => {
        fetchOrders(true); // silent fetch
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [seller, selectedStoreId]);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!selectedStoreId) return;

    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('[socket] Connected to server in Orders:', socketRef.current.id);
    });

    socketRef.current.on('newOrder', (order) => {
      // Allow demo mode selection OR default seller store
      const activeStoreId = selectedStoreId || seller?.storeId;

      if (order.store_id === activeStoreId) {
        setNotification({ show: true, order });
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 5000);

        try {
          const audio = new Audio("/notification.mp3");
          audio.play().catch(e => console.log('Audio playback failed', e));
        } catch (e) {
          console.log('Audio creation failed', e);
        }

        setOrders(prevOrders => {
          // Check if already exists to avoid duplicates (e.g. from polling)
          if (prevOrders.some(o => o.orderId === order.orderId)) return prevOrders;
          return [order, ...prevOrders];
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedStoreId]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/seller/orders/${orderId}/status?store_id=${selectedStoreId}`, { status }, {
        headers: { 'x-seller-id': seller?.id }
      });
      fetchOrders(true);
      // Optional toast notification if preferred over native alerts
      console.log('Order status updated to', status);
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-text-secondary">Process customer orders and update their status.</p>
      </div>

      <div className="bg-[#111111] rounded-2xl border border-[#222] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1a1a1a] text-text-secondary text-sm">
                  <th className="px-6 py-4 font-medium">Order Details</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm mb-1">{order.orderId}</div>
                      <div className="text-xs text-text-secondary">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase
                        ${order.type === 'delivery' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}
                      `}>
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            <span className="text-text-secondary">{item.quantity}x</span> {item.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase
                          ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                            order.status === 'ready' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-green-500/10 text-green-500'}
                        `}>
                          {order.status}
                        </span>
                        
                        <select
                          className="bg-[#222] border border-[#333] text-sm rounded px-2 py-1 outline-none text-white focus:border-dark-pink"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="ready">Ready</option>
                          <option value="collected">Collected</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
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

export default SellerOrders;
