import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock Authentication System
    setTimeout(() => {
      let role = 'USER';
      let name = 'Aditya';
      
      if (email.toLowerCase().includes('admin')) {
        role = 'ADMIN';
        name = 'Farm Admin';
      }

      const userData = { email, name, role };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-jwt-token');
      
      setLoading(false);
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pitaya/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cactus/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white p-8 md:p-12 relative">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pitaya rounded-2xl shadow-lg shadow-pitaya/20 mb-6 transform -rotate-6">
              <Leaf className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to manage your farm profile</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@farm.com or user@farm.com"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-pitaya/20 pl-12 transition-all"
                  required
                />
                <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-pitaya/20 pl-12 pr-12 transition-all"
                  required
                />
                <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm font-bold text-pitaya hover:underline">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-5 text-lg shadow-xl shadow-cactus/20 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-sm text-gray-500 font-medium">
              Don't have an account? <Link to="/register" className="text-pitaya font-bold hover:underline">Join the Farm</Link>
            </p>
            <Link to="/" className="inline-block text-xs text-gray-400 hover:text-gray-600 uppercase tracking-widest font-black transition-colors">
              ← Back to Landing
            </Link>
          </div>
          
          {/* Tip for testing */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Testing Tip</p>
            <p className="text-xs text-gray-500">Use "admin" in email to login as Admin, otherwise you'll be a Standard User.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
