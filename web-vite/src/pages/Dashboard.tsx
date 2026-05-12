import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API = 'https://adarsh-dragon-fruit-farm.onrender.com';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!stored || !token) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);

    fetch(`${API}/api/appointments/user/${u.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => setAppointments(d.appointments || []));

    fetch(`${API}/api/orders/user/${u.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => setOrders(d.orders || []));
  }, []);

  if (!user) return <div className="loading">Loading dashboard…</div>;

  const badgeClass = (s: string) =>
    s === 'ACCEPTED' || s === 'COMPLETED' ? 'badge-accepted'
    : s === 'REJECTED' ? 'badge-rejected'
    : 'badge-pending';

  return (
    <main className="page" style={{ background: 'var(--bg-soft)' }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div className="glass" style={{
          padding: '36px 40px', marginBottom: 36,
          background: 'linear-gradient(135deg, var(--green) 0%, var(--df-pink) 100%)',
          border: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: 6 }}>Welcome, {user.name}! 🌵</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)' }}>Manage your appointments and orders here.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/history" className="btn btn-ghost">📋 History</Link>
              <Link to="/#appointment" className="btn" style={{ background: '#fff', color: 'var(--green)', fontWeight: 700 }}>
                + Book Appointment
              </Link>
            </div>
          </div>
        </div>

        <div className="grid-2">
          {/* Appointments */}
          <div className="glass" style={{ padding: '32px 28px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              📅 Your Appointments
              <span className="badge badge-pending">{appointments.length}</span>
            </h2>
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
                No appointments yet.
                <div style={{ marginTop: 16 }}>
                  <Link to="/#appointment" className="btn btn-green" style={{ fontSize: '0.87rem', padding: '9px 20px' }}>
                    Book Now
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {appointments.map((a: any) => (
                  <div key={a.id} style={{
                    padding: '16px 18px', borderRadius: 12,
                    background: 'var(--bg-soft)',
                    borderLeft: '4px solid var(--green)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>{new Date(a.date).toLocaleDateString()}</span>
                      <span className={`badge ${badgeClass(a.status)}`}>{a.status}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{a.purpose}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders */}
          <div className="glass" style={{ padding: '32px 28px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              🛒 Your Orders
              <span className="badge badge-pending">{orders.length}</span>
            </h2>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛍️</div>
                No orders yet.
                <div style={{ marginTop: 16 }}>
                  <Link to="/marketplace" className="btn btn-pink" style={{ fontSize: '0.87rem', padding: '9px 20px' }}>
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {orders.map((o: any) => (
                  <div key={o.id} style={{
                    padding: '16px 18px', borderRadius: 12,
                    background: 'var(--bg-soft)',
                    borderLeft: '4px solid var(--df-pink)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>Order #{o.id}</span>
                      <span style={{ fontWeight: 700, color: 'var(--df-pink)' }}>₹{o.totalPrice?.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span className={`badge ${badgeClass(o.status)}`}>{o.status}</span>
                      <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
