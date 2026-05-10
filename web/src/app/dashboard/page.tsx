'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../globals.css';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Fetch user specific data
    fetch(`https://adarsh-dragon-fruit-farm.onrender.com/api/appointments/user/${parsedUser.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => setAppointments(data.appointments || []));
    
    fetch(`https://adarsh-dragon-fruit-farm.onrender.com/api/orders/user/${parsedUser.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => setOrders(data.orders || []));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <main style={{ padding: '120px 5% 60px' }}>
      <nav className="navbar scrolled">
        <Link href="/" className="nav-logo">
          Adarsh <span>Dragon Fruit Farm</span>
        </Link>
        <div className="nav-links">
          <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1>Welcome, {user.name}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your appointments and orders here.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          {/* Appointments Column */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Your Appointments</h2>
              <Link href="/#appointment" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Book New</Link>
            </div>
            
            {appointments.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No appointments found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {appointments.map((app: any) => (
                  <div key={app.id} style={{ padding: '15px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: '600' }}>{new Date(app.date).toLocaleDateString()}</span>
                      <span className={`status-badge ${app.status.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>{app.status}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', margin: '0' }}>{app.purpose}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders Column */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Your Orders</h2>
              <Link href="/marketplace" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Marketplace</Link>
            </div>
            
            {orders.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No orders found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {orders.map((order: any) => (
                  <div key={order.id} style={{ padding: '15px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: '600' }}>Order #{order.id}</span>
                      <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>{order.status}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-badge.pending { background: #fff3e0; color: #ef6c00; }
        .status-badge.accepted { background: #e8f5e9; color: #2e7d32; }
        .status-badge.rejected { background: #ffebee; color: #c62828; }
      `}</style>
    </main>
  );
}
