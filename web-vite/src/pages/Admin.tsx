import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API = 'https://adarsh-dragon-fruit-farm.onrender.com';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!stored || !token) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'OWNER') { navigate('/dashboard'); return; }
    setUser(u);
    fetchAll(token);
  }, []);

  const fetchAll = async (token: string) => {
    try {
      const [aRes, lRes] = await Promise.all([
        fetch(`${API}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/activity/logs`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [aData, lData] = await Promise.all([aRes.json(), lRes.json()]);
      setAppointments(aData.appointments || []);
      setLogs(lData.logs || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const patchAppointment = async (id: number, status: string) => {
    const token = localStorage.getItem('token')!;
    await fetch(`${API}/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchAll(token);
  };

  if (!user || loading) return <div className="loading">Accessing Admin Panel…</div>;

  const badgeClass = (s: string) =>
    s === 'ACCEPTED' ? 'badge-accepted' : s === 'REJECTED' ? 'badge-rejected' : 'badge-pending';

  return (
    <main className="page" style={{ background: 'var(--bg-soft)' }}>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div className="glass" style={{
          padding: '32px 40px', marginBottom: 36,
          background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--df-pink-dark) 100%)',
          border: 'none',
        }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: 4 }}>🛠️ Farm Control Center</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Admin Panel — {user.name}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 28 }}>
          {/* Appointments Table */}
          <div className="glass" style={{ padding: '28px', gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 24 }}>📅 Manage Appointments</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    {['Customer', 'Date', 'Purpose', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a: any) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{a.user?.name || '—'}</td>
                      <td style={{ padding: '12px 14px' }}>{new Date(a.date).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)', maxWidth: 200 }}>{a.purpose}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${badgeClass(a.status)}`}>{a.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => patchAppointment(a.id, 'ACCEPTED')}
                            className="btn btn-green" style={{ padding: '5px 14px', fontSize: '0.8rem' }}>
                            Accept
                          </button>
                          <button onClick={() => patchAppointment(a.id, 'REJECTED')}
                            className="btn btn-pink" style={{ padding: '5px 14px', fontSize: '0.8rem' }}>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No appointments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="glass" style={{ padding: '28px', maxHeight: 500, overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 24 }}>🕒 Login & Action History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {logs.map((log: any) => (
                <div key={log.id} style={{
                  padding: '14px 16px', borderRadius: 10,
                  background: 'var(--bg-soft)', borderLeft: '4px solid var(--df-pink)',
                  fontSize: '0.87rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--green)' }}>{log.action}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>{log.details}</p>
                  {log.user && (
                    <div style={{ fontSize: '0.78rem', marginTop: 6, opacity: 0.7 }}>
                      {log.user.name} · {log.user.email}
                    </div>
                  )}
                </div>
              ))}
              {logs.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No history logs found.</p>}
            </div>
          </div>

          {/* Post Activity */}
          <div className="glass" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 24 }}>📢 Post Activity Update</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input className="input" type="text" placeholder="Activity Title" />
              <textarea className="input" placeholder="Write update details here…" rows={4}
                style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
              <button type="button" className="btn btn-green" style={{ width: '100%' }}>Post Update</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
