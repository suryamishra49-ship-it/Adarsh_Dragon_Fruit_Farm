import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = 'https://adarsh-dragon-fruit-farm.onrender.com';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(data.user.role === 'OWNER' ? '/admin' : '/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--green-soft) 0%, #fff 50%, var(--df-pink-soft) 100%)',
      padding: '40px 5%',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: '5%', left: '5%', width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(46,125,50,0.12) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '5%', right: '5%', width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(233,30,140,0.12) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="glass" style={{ width: '100%', maxWidth: 460, padding: '50px 40px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '2.8rem', marginBottom: 10 }}>🌵</div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to your Adarsh Farm account</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.92rem' }}>
              Email Address
            </label>
            <input
              className="input" type="email" placeholder="name@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.92rem' }}>
              Password
            </label>
            <input
              className="input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="btn btn-green"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--df-pink)', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
          <Link to="/" style={{ display: 'block', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
