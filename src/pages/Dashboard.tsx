import { useState, useEffect } from 'react';
import { 
  CheckCircle2, Truck, Box, Calculator, 
  Calendar, Heart, MapPin, Package, Star, Clock, 
  Trash2, AlertTriangle, HelpCircle, FileText
} from 'lucide-react';
import NutrientCalculator from '../components/NutrientCalculator';
import { logActivity } from '../utils/logger';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'orders' | 'visits' | 'tools'>('orders');

  const fetchUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Fetch Orders
      const allOrders = JSON.parse(localStorage.getItem('farm_orders') || '[]');
      const userOrders = allOrders.filter((o: any) => o.userEmail === parsedUser.email);
      setOrders(userOrders);

      // Fetch Visits
      const allVisits = JSON.parse(localStorage.getItem('farm_visits') || '[]');
      const userVisits = allVisits.filter((v: any) => v.loginId === parsedUser.loginId);
      setVisits(userVisits);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCancelVisit = (visitId: string) => {
    if (!window.confirm('Are you sure you want to cancel this farm visit request?')) return;

    const allVisits = JSON.parse(localStorage.getItem('farm_visits') || '[]');
    const updatedVisits = allVisits.map((v: any) => {
      if (v.id === visitId) {
        return { ...v, status: 'Cancelled' };
      }
      return v;
    });

    localStorage.setItem('farm_visits', JSON.stringify(updatedVisits));

    // Log the cancellation using the helper to ensure consistent schema
    logActivity('APPOINTMENT_CANCELLED', `Visit request ${visitId} was cancelled by the customer.`, user);

    // Update notifications for user
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const idx = users.findIndex((u: any) => u.loginId === user.loginId);
    if (idx > -1) {
      const notify = {
        id: Date.now(),
        type: 'warning',
        title: 'Visit Cancelled',
        message: `Your visit scheduled for ${visitId} has been marked as Cancelled.`,
        date: new Date().toISOString(),
        read: false
      };
      users[idx].notifications = [notify, ...(users[idx].notifications || [])];
      localStorage.setItem('users_db', JSON.stringify(users));
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.notifications = users[idx].notifications;
      localStorage.setItem('user', JSON.stringify(currentUser));
    }

    fetchUserData();
  };

  if (!user) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-28 pb-20 font-sans">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* User Profile Card */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-850 sticky top-28">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-cactus flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl shadow-cactus/20">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{user.name}</h2>
                <p className="text-xs font-bold text-slate-400 mb-8">{user.email}</p>
                <div className="flex items-center space-x-2 bg-cactus/5 px-4 py-2 rounded-full border border-cactus/10 text-cactus text-[10px] font-black uppercase tracking-widest">
                  <Star size={12} fill="currentColor" />
                  <span>Loyal Grower</span>
                </div>
              </div>

              <div className="mt-12 space-y-2">
                <ProfileBtn 
                  icon={<Package size={18}/>} 
                  label="My Orders" 
                  active={activeView === 'orders'} 
                  onClick={() => setActiveView('orders')}
                />
                <ProfileBtn 
                  icon={<Calendar size={18}/>} 
                  label="Farm Visits" 
                  active={activeView === 'visits'} 
                  onClick={() => setActiveView('visits')}
                  count={visits.filter(v => v.status === 'Pending').length}
                />
                <ProfileBtn 
                  icon={<Calculator size={18}/>} 
                  label="Farmer Utilities" 
                  active={activeView === 'tools'} 
                  onClick={() => setActiveView('tools')}
                />
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow">
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* ORDERS TAB */}
              {activeView === 'orders' && (
                <>
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Order Bookings</h1>
                    <div className="text-xs font-bold text-slate-400">Total {orders.length} orders</div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-slate-100 dark:border-slate-850 shadow-sm">
                      <div className="bg-slate-50 dark:bg-slate-950 w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-slate-350 dark:text-slate-650">
                        <Box size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No bookings yet</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto text-xs leading-relaxed font-semibold">You haven't booked any plant cuttings or seasonal fruits from our farm yet.</p>
                      <button onClick={() => window.location.href = '/marketplace'} className="btn-primary px-10 py-4 text-xs uppercase tracking-widest cursor-pointer">Start Shopping</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => {
                        const hasPreorders = order.items.some((it: any) => it.schedule && it.schedule.includes('Pre-order'));
                        return (
                          <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-850 hover:shadow-xl transition-all">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-slate-50 dark:border-slate-850">
                              <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                  <span className="text-xl font-black text-slate-900 dark:text-white">{order.id}</span>
                                  <StatusBadge status={order.status} />
                                  {hasPreorders && (
                                    <span className="bg-pink-50 dark:bg-pink-950/30 text-pitaya border border-pink-100 dark:border-pink-900/50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                      Contains Pre-orders
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ordered on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                              <div className="text-left md:text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-1">Total Booked</p>
                                <span className="text-2xl font-black text-cactus">₹{order.total}</span>
                              </div>
                            </div>

                            {/* Tracking Progress */}
                            <div className="mb-10">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-450 mb-8">Dispatched Progress</h4>
                              <div className="relative">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2"></div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 -mx-8 -mb-8 px-8 py-8 rounded-b-[3rem]">
                              <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-450 mb-4">Delivery & Tracking</h4>
                                {order.trackingId ? (
                                  <div className="space-y-4">
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                                      <span className="font-bold text-slate-900 dark:text-white text-xs">{order.trackingId}</span>
                                      <span className="text-cactus font-black text-[9px] uppercase tracking-widest">In Transit</span>
                                    </div>
                                    <div className="space-y-3 pl-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-1.5 h-1.5 bg-cactus rounded-full"></div>
                                        <p>Dispatched from Pratapgarh Farm Hub</p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic space-y-1">
                                    <p>Awaiting dispatch queue.</p>
                                    {hasPreorders && (
                                      <p className="text-pitaya not-italic text-[10px] font-bold">
                                        * Pre-ordered items will dispatch following the seasonal harvest schedule.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-450 mb-4">Summary of Cuttings</h4>
                                <div className="space-y-2">
                                  {order.items.map((it: any) => (
                                    <div key={it.id} className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                                      <div className="text-left">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-300">{it.quantity}x {it.name}</span>
                                        {it.schedule && it.schedule.includes('Pre-order') && (
                                          <p className="text-[9px] text-pink-500 font-bold">{it.schedule}</p>
                                        )}
                                      </div>
                                      <span className="text-xs font-black text-cactus shrink-0">₹{it.price * it.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* FARM VISITS TAB */}
              {activeView === 'visits' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Guided Farm Tours</h1>
                      <p className="text-slate-400 text-xs font-bold mt-1">Manage visit schedules and check gate pass entry requirements</p>
                    </div>
                    <div className="text-sm font-bold text-slate-400">Total {visits.length} requests</div>
                  </div>

                  {visits.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-slate-100 dark:border-slate-850 shadow-sm">
                      <div className="bg-slate-50 dark:bg-slate-950 w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-slate-350 dark:text-slate-650">
                        <Calendar size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No visits booked</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto text-xs leading-relaxed font-semibold">Schedule a tour to walk the rows of our dragon fruit plantations.</p>
                      <button onClick={() => window.location.href = '/visit'} className="btn-primary px-10 py-4 text-xs uppercase tracking-widest cursor-pointer">Schedule Farm Tour</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {visits.map((visit) => (
                        <div key={visit.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-base font-black text-slate-900 dark:text-white">{visit.tourType || 'General Farm Tour'}</span>
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                visit.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' :
                                visit.status === 'Denied' ? 'bg-red-50 text-red-600' :
                                visit.status === 'Cancelled' ? 'bg-slate-100 text-slate-500' :
                                'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20'
                              }`}>
                                {visit.status}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                              <p className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-cactus" />
                                <span>{visit.date}</span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Clock size={14} className="text-cactus" />
                                <span>{visit.time}</span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Users size={14} className="text-cactus" />
                                <span>{visit.guests} Visitors</span>
                              </p>
                            </div>
                          </div>

                          <div className="w-full md:w-auto flex flex-col items-start md:items-end justify-between self-stretch border-t md:border-t-0 border-slate-100 dark:border-slate-850 pt-4 md:pt-0">
                            <div className="mb-4 md:mb-0 md:text-right">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-450 block">Entry Fee</span>
                              <span className="text-lg font-black text-slate-900 dark:text-white">
                                {visit.totalPrice === 0 ? 'Free' : `₹${visit.totalPrice || visit.guests * 100}`}
                              </span>
                            </div>
                            
                            {visit.status === 'Pending' && (
                              <button 
                                onClick={() => handleCancelVisit(visit.id)}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-650 cursor-pointer pt-2"
                              >
                                <Trash2 size={12} />
                                <span>Cancel Tour Request</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* FARM UTILITIES TAB */}
              {activeView === 'tools' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Grower Utilities</h1>
                    <p className="text-slate-400 text-xs font-bold mt-1">Smart mathematical tools to optimize your pitaya crop nutrition.</p>
                  </div>
                  <NutrientCalculator />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileBtn({ icon, label, active, onClick, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all cursor-pointer ${
        active 
          ? 'bg-cactus text-white shadow-lg shadow-cactus/20' 
          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
          active ? 'bg-white text-cactus' : 'bg-cactus/15 text-cactus'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'Pending': 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/40',
    'Processing': 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40',
    'Shipped': 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40',
    'Delivered': 'text-green-500 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
}

function TrackingStep({ icon, label, active }: any) {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        active ? 'bg-cactus text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-850 text-slate-350'
      }`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest mt-3 ${active ? 'text-slate-900 dark:text-white font-black' : 'text-slate-350'}`}>
        {label}
      </span>
    </div>
  );
}
