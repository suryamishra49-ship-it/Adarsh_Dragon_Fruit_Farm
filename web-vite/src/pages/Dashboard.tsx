import { useState, useEffect } from 'react';
import { 
  User, Package, Calendar, Settings, 
  MapPin, Phone, Mail, ShoppingCart,
  ArrowRight, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pitaya"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Profile Header */}
      <div className="gradient-pink-white pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl rotate-3">
              <div className="w-full h-full rounded-[2rem] bg-gray-100 flex items-center justify-center text-4xl font-black text-gray-400">
                {user.name[0]}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-white mb-2 drop-shadow-md">Hello, {user.name}!</h1>
              <p className="text-white/80 font-medium flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} /> <span>Maharashtra, India</span>
                <span className="mx-2">•</span>
                <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">Standard User</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/marketplace" className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-cactus/10 rounded-2xl text-cactus group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <ArrowRight className="text-gray-300 group-hover:text-cactus transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">My Orders</h3>
                <p className="text-gray-500 text-sm">Track your shipments and order history.</p>
              </Link>

              <Link to="/visit" className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-pitaya/10 rounded-2xl text-pitaya group-hover:scale-110 transition-transform">
                    <Calendar size={24} />
                  </div>
                  <ArrowRight className="text-gray-300 group-hover:text-pitaya transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Visits</h3>
                <p className="text-gray-500 text-sm">Manage your upcoming farm visits.</p>
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Heart className="text-pitaya" /> <span>Saved Plants</span>
              </h3>
              <div className="text-center py-12">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <ShoppingCart size={32} />
                </div>
                <p className="text-gray-500">Your wishlist is empty. Start exploring the marketplace!</p>
                <Link to="/marketplace" className="inline-block mt-6 text-pitaya font-bold hover:underline">Browse Products</Link>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Account Details</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Mail size={18} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-300 tracking-widest">Email</p>
                    <p className="text-sm font-bold text-gray-700">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Phone size={18} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-300 tracking-widest">Phone</p>
                    <p className="text-sm font-bold text-gray-700">+91 96289 84643</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-10 py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Settings size={16} /> Edit Profile
              </button>
            </div>

            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Want to Sell?</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">Join our Seller Program to list your own dragon fruit harvest on our marketplace.</p>
                <button className="text-cactus font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  Learn More <ArrowRight size={14} />
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cactus/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
