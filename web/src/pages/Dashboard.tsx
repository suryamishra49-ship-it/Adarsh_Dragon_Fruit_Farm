import { useState, useEffect } from 'react';
import { 
  Package, Heart, 
  MapPin, Star, Clock,
  CheckCircle2, Truck, Box
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      const allOrders = JSON.parse(localStorage.getItem('farm_orders') || '[]');
      const userOrders = allOrders.filter((o: any) => o.userEmail === parsedUser.email);
      setOrders(userOrders);
    }
  }, []);

  if (!user) return null;

  return (
    <div className="bg-[#fafafa] min-h-screen pt-28 pb-20 font-sans">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* User Profile Card */}
          <aside className="lg:w-80">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 sticky top-28">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-cactus flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl shadow-cactus/20">
                  {user.name[0]}
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">{user.name}</h2>
                <p className="text-sm font-bold text-gray-400 mb-8">{user.email}</p>
                <div className="flex items-center space-x-2 bg-cactus/5 px-4 py-2 rounded-full border border-cactus/10 text-cactus text-[10px] font-black uppercase tracking-widest">
                  <Star size={12} fill="currentColor" />
                  <span>Loyal Farmer</span>
                </div>
              </div>

              <div className="mt-12 space-y-2">
                <ProfileBtn icon={<Package size={18}/>} label="My Orders" active />
                <ProfileBtn icon={<Heart size={18}/>} label="Wishlist" />
                <ProfileBtn icon={<MapPin size={18}/>} label="Addresses" />
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Tracking</h1>
                <div className="text-sm font-bold text-gray-400">Total {orders.length} orders</div>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                  <div className="bg-gray-50 w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
                    <Box size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-8">You haven't placed any orders from our farm yet.</p>
                  <button onClick={() => window.location.href = '/marketplace'} className="btn-primary px-10 py-4">Start Shopping</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-gray-50">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xl font-black text-gray-900">{order.id}</span>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Paid</p>
                          <span className="text-2xl font-black text-cactus">₹{order.total}</span>
                        </div>
                      </div>

                      {/* Tracking Progress */}
                      <div className="mb-10">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Shipping Progress</h4>
                        <div className="relative">
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-50 -translate-y-1/2"></div>
                          <div className={`absolute top-1/2 left-0 h-1 bg-cactus -translate-y-1/2 transition-all duration-1000 ${
                            order.status === 'Pending' ? 'w-0' :
                            order.status === 'Processing' ? 'w-1/3' :
                            order.status === 'Shipped' ? 'w-2/3' : 'w-full'
                          }`}></div>
                          <div className="relative flex justify-between">
                            <TrackingStep icon={<CheckCircle2 size={16}/>} label="Placed" active={true} />
                            <TrackingStep icon={<Clock size={16}/>} label="Processing" active={order.status !== 'Pending'} />
                            <TrackingStep icon={<Truck size={16}/>} label="Shipped" active={order.status === 'Shipped' || order.status === 'Delivered'} />
                            <TrackingStep icon={<Package size={16}/>} label="Delivered" active={order.status === 'Delivered'} />
                          </div>
                        </div>
                      </div>

                      {/* Details & Tracking ID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50 bg-gray-50/50 -mx-8 -mb-8 px-8 py-8 rounded-b-[3rem]">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Tracking Information</h4>
                          {order.trackingId ? (
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                              <span className="font-bold text-gray-900">{order.trackingId}</span>
                              <button className="text-cactus font-black text-[10px] uppercase tracking-widest hover:underline">Track Link</button>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-gray-400 italic">Tracking ID will be provided once shipped.</p>
                          )}
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Items Summary</h4>
                          <p className="text-sm font-bold text-gray-800">
                            {order.items.map((it: any) => `${it.quantity}x ${it.name}`).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileBtn({ icon, label, active }: any) {
  return (
    <button className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all ${
      active ? 'bg-cactus text-white shadow-lg shadow-cactus/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'Pending': 'text-yellow-500 bg-yellow-50',
    'Processing': 'text-blue-500 bg-blue-50',
    'Shipped': 'text-purple-500 bg-purple-50',
    'Delivered': 'text-green-500 bg-green-50'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
}

function TrackingStep({ icon, label, active }: any) {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        active ? 'bg-cactus text-white shadow-lg' : 'bg-white border-2 border-gray-100 text-gray-300'
      }`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest mt-3 ${active ? 'text-gray-900' : 'text-gray-300'}`}>
        {label}
      </span>
    </div>
  );
}
