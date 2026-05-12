import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Leaf } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/marketplace' },
    { name: 'AI Doctor', path: '/scanner' },
    { name: 'Visit', path: '/visit' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-pitaya p-1.5 rounded-lg shadow-lg">
            <Leaf className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">
            Adarsh <span className="text-pitaya">Dragon Fruit</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-600 hover:text-pitaya font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center space-x-4 ml-4">
              <Link
                to={user.role === 'OWNER' || user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="flex items-center space-x-1 text-gray-700 hover:text-cactus font-medium"
              >
                <User size={18} />
                <span>{user.role === 'OWNER' || user.role === 'ADMIN' ? 'Admin' : 'Profile'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-lg font-medium text-gray-800 hover:text-pitaya border-b border-gray-50 pb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={user.role === 'OWNER' || user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="text-lg font-medium text-gray-800 hover:text-cactus"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user.role === 'OWNER' || user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-lg font-medium text-red-500 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
