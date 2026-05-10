'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../globals.css';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'OWNER') {
      router.push('/dashboard');
      return;
    }
    
    setUser(parsedUser);
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const [appRes, actRes, logRes] = await Promise.all([
        fetch('https://adarsh-dragon-fruit-farm.onrender.com/api/appointments', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://adarsh-dragon-fruit-farm.onrender.com/api/activity'),
        fetch('https://adarsh-dragon-fruit-farm.onrender.com/api/activity/logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const appData = await appRes.json();
      const actData = await actRes.json();
      const logData = await logRes.json();
      
      setAppointments(appData.appointments || []);
      setActivities(actData.activities || []);
      setLogs(logData.logs || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://adarsh-dragon-fruit-farm.onrender.com/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchData(token!);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user || loading) return <div className="loading-state">Accessing Admin Panel...</div>;

  return (
    <main style={{ padding: '120px 5% 60px', background: 'var(--bg-soft)', minHeight: '100vh' }}>
      <nav className="navbar scrolled">
        <div className="nav-logo">
          Adarsh <span>Admin Panel</span>
        </div>
        <div className="nav-links">
          <Link href="/" className="nav-link">View Site</Link>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '40px' }}>Farm Control Center</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
          
          {/* Appointment Management */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Manage Appointments</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    <th style={{ padding: '10px' }}>Customer</th>
                    <th style={{ padding: '10px' }}>Date</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app: any) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{app.user.name}</td>
                      <td style={{ padding: '10px' }}>{new Date(app.date).toLocaleDateString()}</td>
                      <td style={{ padding: '10px' }}>
                        <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                      </td>
                      <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                        <button onClick={() => updateAppointmentStatus(app.id, 'ACCEPTED')} className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>Accept</button>
                        <button onClick={() => updateAppointmentStatus(app.id, 'REJECTED')} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity & History */}
          <div className="glass-panel" style={{ padding: '30px', maxHeight: '600px', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Login & Action History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {logs.map((log: any) => (
                <div key={log.id} style={{ padding: '15px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{log.action}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: '0' }}>{log.details}</p>
                  {log.user && <div style={{ fontSize: '0.75rem', marginTop: '5px', opacity: '0.7' }}>User: {log.user.name} ({log.user.email})</div>}
                </div>
              ))}
              {logs.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No history logs found.</p>}
            </div>
          </div>

          {/* Website Control */}
          <div className="glass-panel" style={{ padding: '30px', gridColumn: '1 / -1' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
              <div>
                <h2 style={{ marginBottom: '20px' }}>Post Activity Update</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input type="text" placeholder="Activity Title" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <textarea placeholder="Write update details here..." rows={4} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}></textarea>
                  <button type="button" className="btn-primary">Post Update</button>
                </form>
              </div>
              <div>
                <h2 style={{ marginBottom: '20px' }}>Gallery Manager</h2>
                <div style={{ padding: '40px', border: '2px dashed #ddd', textAlign: 'center', borderRadius: '12px' }}>
                  <p>Upload photos to activity gallery</p>
                  <button className="btn-secondary">Choose Files</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .status-badge {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        .status-badge.pending { background: #fff3e0; color: #ef6c00; }
        .status-badge.accepted { background: #e8f5e9; color: #2e7d32; }
        .status-badge.rejected { background: #ffebee; color: #c62828; }
      `}</style>
    </main>
  );
}
