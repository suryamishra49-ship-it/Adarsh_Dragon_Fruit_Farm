'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../globals.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('CUSTOMER'); // 'CUSTOMER' or 'OWNER'
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('https://adarsh-dragon-fruit-farm.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Double check if the user role matches the tab
        if (data.user.role !== activeTab) {
          setError(`This account is not registered as an ${activeTab === 'OWNER' ? 'Owner' : 'Customer'}.`);
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'OWNER') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Could not connect to server');
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-soft)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Sign In</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px' }}>Access your Adarsh Farm account</p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#eee', borderRadius: '12px', padding: '5px', marginBottom: '30px' }}>
          <button 
            onClick={() => setActiveTab('CUSTOMER')}
            style={{ 
              flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer',
              background: activeTab === 'CUSTOMER' ? 'white' : 'transparent',
              fontWeight: activeTab === 'CUSTOMER' ? '700' : '500',
              boxShadow: activeTab === 'CUSTOMER' ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Customer
          </button>
          <button 
            onClick={() => setActiveTab('OWNER')}
            style={{ 
              flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer',
              background: activeTab === 'OWNER' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'OWNER' ? 'white' : 'black',
              fontWeight: activeTab === 'OWNER' ? '700' : '500',
              boxShadow: activeTab === 'OWNER' ? '0 4px 10px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            Owner / Admin
          </button>
        </div>
        
        {error && <div style={{ color: '#d32f2f', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem', padding: '10px', background: '#ffebee', borderRadius: '8px' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            {activeTab === 'OWNER' ? 'Admin Login' : 'Customer Login'}
          </button>
        </form>
        
        {activeTab === 'CUSTOMER' && (
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            New user? <Link href="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Create an account</Link>
          </p>
        )}
      </div>
    </main>
  );
}
