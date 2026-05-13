import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Leaf, LogOut, Bell, CheckCircle, AlertCircle, Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const markAsRead = () => {
    if (!user) return;
    const updatedUser = { ...user, notifications: user.notifications.map((n: any) => ({ ...n, read: true })) };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update users_db too
    const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
    const idx = usersDb.findIndex((u: any) => u.loginId === user.loginId);
    if (idx > -1) {
      usersDb[idx] = updatedUser;
      localStorage.setItem('users_db', JSON.stringify(usersDb));
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/marketplace' },
    { name: 'AI Doctor', path: '/scanner' },
    { name: 'Visit', path: '/visit' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const unreadCount = user?.notifications?.filter((n: any) => !n.read).length || 0;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-cactus/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-cactus p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
            <Leaf size={24} />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tighter">
            ADARSH <span className="text-cactus">FARM</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-sm font-bold tracking-widest uppercase transition-all hover:text-cactus ${
                isActive(link.path) ? 'text-cactus' : 'text-gray-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) markAsRead();
                  }}
                  className="p-2 text-gray-400 hover:text-cactus transition-colors relative"
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pitaya text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                      <span className="font-black text-gray-900">Notifications</span>
                      <span className="text-[10px] font-black uppercase text-cactus">{unreadCount} New</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {user.notifications?.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 italic text-sm">No notifications yet.</div>
                      ) : (
                        user.notifications.map((n: any) => (
                          <div key={n.id} className={`p-5 border-b border-gray-50 flex items-start space-x-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-cactus/5' : ''}`}>
                            <div className={`p-2 rounded-xl mt-1 ${
                              n.type === 'success' ? 'bg-green-100 text-green-600' :
                              n.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {n.type === 'success' ? <CheckCircle size={16}/> : 
                               n.type === 'error' ? <AlertCircle size={16}/> : <Info size={16}/>}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-gray-300 font-bold uppercase mt-2">{new Date(n.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-2 bg-cactus/5 px-4 py-2 rounded-full border border-cactus/10 hover:bg-cactus/10 transition-all">
                <div className="w-6 h-6 rounded-full bg-cactus flex items-center justify-center text-[10px] text-white font-black">
                  {user.name[0]}
                </div>
                <span className="text-sm font-bold text-gray-700">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-4 py-2">Login</Link>
              <Link to="/login" className="btn-primary text-sm">Join Now</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-gray-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-cactus/5 absolute top-20 left-0 w-full py-8 px-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`text-lg font-black tracking-tighter transition-all ${
                  isActive(link.path) ? 'text-cactus' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-lg font-black text-gray-900" onClick={() => setIsOpen(false)}>My Profile ({unreadCount} new)</Link>
                  <button onClick={handleLogout} className="text-lg font-black text-red-500 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-lg font-black text-gray-900" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/login" className="btn-primary text-center py-4 text-lg" onClick={() => setIsOpen(false)}>Join Now</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
