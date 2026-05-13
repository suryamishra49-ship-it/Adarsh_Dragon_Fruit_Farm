import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        alert('Registration successful! Please check your email for confirmation.');
        navigate('/login');
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--df-pink-soft) 0%, #fff 50%, var(--green-soft) 100%)',
      padding: '40px 5%',
    }}>
      <div style={{ position: 'fixed', top: '5%', right: '5%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(233,30,140,0.1) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="glass" style={{ width: '100%', maxWidth: 460, padding: '50px 40px', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '2.8rem', marginBottom: 10 }}>🌱</div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Join the Adarsh Dragon Fruit community</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.92rem' }}>Full Name</label>
            <input className="input" type="text" placeholder="Your full name"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.92rem' }}>Email Address</label>
            <input className="input" type="email" placeholder="name@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.92rem' }}>Password</label>
            <input className="input" type="password" placeholder="Min 8 characters"
              value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button
            type="submit" disabled={loading}
            className="btn btn-pink"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--green)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
