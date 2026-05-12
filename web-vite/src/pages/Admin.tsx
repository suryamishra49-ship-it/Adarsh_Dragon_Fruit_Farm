import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Image as ImageIcon, Users, 
  Settings, Check, X, Plus, Trash2, 
  Search, ExternalLink, Activity
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'orders' | 'gallery' | 'logs'>('orders');
  const [orders, setOrders] = useState([
    { id: 101, customer: 'John Doe', product: 'Red Dragon Fruit', amount: 450, status: 'Pending', date: '2026-05-12' },
    { id: 102, customer: 'Jane Smith', product: 'Grafted Plant', amount: 1350, status: 'Shipped', date: '2026-05-11' },
    { id: 103, customer: 'Raj K.', product: 'Yellow Pitaya', amount: 280, status: 'Cancelled', date: '2026-05-10' },
  ]);

  const [galleryEnabled, setGalleryEnabled] = useState(true);

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Admin <span className="text-pitaya">Dashboard</span></h1>
              <p className="text-gray-500">Welcome back, Farm Manager</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-white shadow-sm text-cactus' : 'text-gray-500 hover:bg-white/50'}`}
              >
                <ShoppingBag size={18} /> <span>Orders</span>
              </button>
              <button 
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'gallery' ? 'bg-white shadow-sm text-cactus' : 'text-gray-500 hover:bg-white/50'}`}
              >
                <ImageIcon size={18} /> <span>Gallery</span>
              </button>
              <button 
                onClick={() => setActiveTab('logs')}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'logs' ? 'bg-white shadow-sm text-cactus' : 'text-gray-500 hover:bg-white/50'}`}
              >
                <Activity size={18} /> <span>Logs</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
              <div className="relative">
                <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-cactus/20" />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-500 text-sm font-bold">
                  <tr>
                    <th className="px-8 py-4">ID</th>
                    <th className="px-8 py-4">Customer</th>
                    <th className="px-8 py-4">Product</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6 font-mono text-xs text-gray-400">#{order.id}</td>
                      <td className="px-8 py-6 font-bold text-gray-800">{order.customer}</td>
                      <td className="px-8 py-6 text-gray-600">{order.product}</td>
                      <td className="px-8 py-6 font-black text-gray-900">₹{order.amount}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                          order.status === 'Shipped' ? 'bg-green-100 text-green-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Shipped')}
                            className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                            title="Mark as Shipped"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Cancel Order"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Gallery Management</h2>
                <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-500">Live Status</span>
                  <button 
                    onClick={() => setGalleryEnabled(!galleryEnabled)}
                    className={`w-12 h-6 rounded-full transition-all relative ${galleryEnabled ? 'bg-cactus' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${galleryEnabled ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    <img src={`https://images.unsplash.com/photo-${1527324688151 + i}-0e627063f2b1?w=400`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button className="p-2 bg-white rounded-full text-red-500 shadow-lg hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                      <button className="p-2 bg-white rounded-full text-gray-800 shadow-lg hover:scale-110 transition-transform"><ExternalLink size={16}/></button>
                    </div>
                  </div>
                ))}
                <button className="aspect-video border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-cactus hover:text-cactus transition-all group">
                  <div className="bg-gray-50 p-3 rounded-full mb-2 group-hover:bg-cactus/10">
                    <Plus size={24} />
                  </div>
                  <span className="text-sm font-bold">Add Media</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h3 className="font-bold text-gray-800 mb-4">Gallery Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Total Items</span>
                    <span className="font-black text-gray-900 text-xl">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Videos</span>
                    <span className="font-black text-gray-900 text-xl">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Photos</span>
                    <span className="font-black text-gray-900 text-xl">34</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-pitaya p-8 rounded-3xl text-white shadow-xl shadow-pitaya/20 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold mb-2">Need Help?</h3>
                  <p className="text-sm opacity-80 mb-6 leading-relaxed">Check the documentation for advanced management features.</p>
                  <button className="bg-white text-pitaya px-6 py-2 rounded-xl font-bold text-sm">View Guide</button>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Activity Logs</h2>
            <div className="space-y-6">
              {[
                { action: 'Product Added', user: 'Admin', time: '10 mins ago', details: 'Added Yellow Dragon Fruit to Marketplace' },
                { action: 'Order Shipped', user: 'Admin', time: '2 hours ago', details: 'Marked Order #102 as Shipped' },
                { action: 'Login Success', user: 'Aditya', time: '5 hours ago', details: 'Standard user login from Mumbai' },
              ].map((log, i) => (
                <div key={i} className="flex items-start space-x-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="bg-gray-100 p-3 rounded-2xl text-gray-500">
                    <Activity size={20} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-gray-800">{log.action}</p>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{log.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{log.details}</p>
                    <p className="text-[10px] font-bold text-cactus bg-cactus/10 inline-block px-2 py-0.5 rounded-full uppercase">By {log.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
