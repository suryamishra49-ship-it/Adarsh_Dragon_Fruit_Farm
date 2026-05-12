import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

const SUPER_ADMIN_EMAIL = 'surya.mishra49@gmail.com';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated Auth Logic
    setTimeout(() => {
      // Check if email is in the verified admins list (from localStorage)
      const verifiedAdmins = JSON.parse(localStorage.getItem('verified_admins') || '[]');
      const isVerifiedAdmin = verifiedAdmins.includes(email);
      const isSuperAdmin = email === SUPER_ADMIN_EMAIL;

      const role = (isSuperAdmin || isVerifiedAdmin) ? 'admin' : 'user';
      
      const user = {
        id: '1',
        name: isSuperAdmin ? 'Super Admin' : (role === 'admin' ? 'Farm Manager' : 'Happy Farmer'),
        email: email,
        role: role
      };

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock_jwt_token_123');

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side: Visuals */}
      <div className="hidden lg:flex bg-farm-green items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/bg-dragon-fruit.png')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 p-12 text-center text-white">
          <div className="bg-white/20 backdrop-blur-xl p-6 rounded-[3rem] inline-block mb-8 border border-white/30">
            <Leaf size={64} className="text-white" />
          </div>
          <h2 className="text-5xl font-black mb-6 tracking-tighter">Grow With Us</h2>
          <p className="text-xl text-white/80 max-w-md mx-auto font-medium">
            Join the largest community of dragon fruit farmers in Maharashtra.
          </p>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cactus/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <Link to="/" className="flex items-center space-x-2 text-farm-green mb-8 group">
              <div className="bg-cactus/10 p-2 rounded-xl group-hover:bg-cactus/20 transition-colors">
                <Leaf size={20} />
              </div>
              <span className="font-black tracking-tighter">ADARSH FARM</span>
            </Link>
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cactus transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-cactus/10 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cactus transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-cactus/10 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-cactus focus:ring-cactus" />
                <span className="text-sm font-bold text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm font-bold text-cactus hover:underline">Forgot password?</button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-5 text-lg shadow-2xl shadow-cactus/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-12 p-6 bg-soft-green/30 rounded-3xl border border-cactus/10 text-center">
            <p className="text-sm font-medium text-gray-600">Don't have an account?</p>
            <Link to="/register" className="text-farm-green font-black uppercase tracking-widest text-xs mt-2 inline-block hover:underline">Create an account</Link>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-2 text-gray-400">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Admin Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
