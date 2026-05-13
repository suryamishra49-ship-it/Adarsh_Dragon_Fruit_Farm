import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API = 'https://adarsh-dragon-fruit-farm.onrender.com';

type HistoryEntry = {
  id: number;
  action: string;
  details: string;
  createdAt: string;
  user?: { name: string; email: string };
};

const ACTION_ICONS: Record<string, string> = {
  LOGIN: '🔐',
  LOGOUT: '🚪',
  APPOINTMENT_CREATED: '📅',
  APPOINTMENT_UPDATED: '✏️',
  ORDER_PLACED: '🛒',
  PROFILE_UPDATED: '👤',
  DEFAULT: '📋',
};

const getIcon = (action: string) =>
  ACTION_ICONS[action] || ACTION_ICONS.DEFAULT;

const getColor = (action: string) => {
  if (action.includes('LOGIN')) return 'var(--green)';
  if (action.includes('LOGOUT')) return 'var(--text-muted)';
  if (action.includes('APPOINTMENT')) return '#1565C0';
  if (action.includes('ORDER')) return 'var(--df-pink)';
  return 'var(--text-dark)';
};

export default function History() {
  const [logs, setLogs] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = (() => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })();

    if (!user) { navigate('/login'); return; }

    const allLogs = JSON.parse(localStorage.getItem('farm_activity_logs') || '[]');
    
    if (user.role === 'admin') {
      setLogs(allLogs);
    } else {
      setLogs(allLogs.filter((l: any) => l.user?.email === (user.email || user.loginId)));
    }
    setLoading(false);
  }, []);

  const actionTypes = ['ALL', ...Array.from(new Set(logs.map(l => l.action)))];
  const filtered = filter === 'ALL' ? logs : logs.filter(l => l.action === filter);

  if (loading) return <div className="loading">Loading history…</div>;

  return (
    <main className="page" style={{ background: 'var(--bg-soft)' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Page Header */}
        <div className="glass" style={{
          padding: '36px 40px', marginBottom: 36,
          background: 'linear-gradient(135deg, var(--green) 0%, var(--df-pink) 100%)',
          border: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: 4 }}>📋 Activity History</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
                {user?.role === 'OWNER' ? 'All platform activity across all users' : 'Your personal activity timeline'}
              </p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 12, padding: '16px 24px', textAlign: 'center', color: '#fff',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{logs.length}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Total Events</div>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-info" style={{ marginBottom: 24 }}>{error}</div>}

        {/* Stats row */}
        <div className="grid-3" style={{ marginBottom: 32 }}>
          {[
            { label: 'Logins', count: logs.filter(l => l.action === 'LOGIN').length, color: 'var(--green)', icon: '🔐' },
            { label: 'Appointments', count: logs.filter(l => l.action?.includes('APPOINTMENT')).length, color: '#1565C0', icon: '📅' },
            { label: 'Orders', count: logs.filter(l => l.action?.includes('ORDER')).length, color: 'var(--df-pink)', icon: '🛒' },
          ].map(s => (
            <div key={s.label} className="glass" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>
                {s.count}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          {actionTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: '7px 18px', borderRadius: 50, fontSize: '0.83rem', fontWeight: 600,
                border: '2px solid',
                borderColor: filter === type ? 'var(--df-pink)' : 'var(--border)',
                background: filter === type ? 'var(--df-pink)' : '#fff',
                color: filter === type ? '#fff' : 'var(--text-dark)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {getIcon(type)} {type === 'ALL' ? 'All Events' : type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* vertical line */}
          <div style={{
            position: 'absolute', left: 20, top: 0, bottom: 0, width: 2,
            background: 'linear-gradient(to bottom, var(--green), var(--df-pink))',
            borderRadius: 2, opacity: 0.25,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 52 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 14 }}>📭</div>
                <p>No history events found for this filter.</p>
              </div>
            ) : (
              filtered.map((log, i) => (
                <div
                  key={log.id}
                  style={{ position: 'relative', animation: `fadeSlideIn 0.3s ease ${i * 0.05}s both` }}
                >
                  {/* dot */}
                  <div style={{
                    position: 'absolute', left: -40, top: 18, width: 16, height: 16,
                    borderRadius: '50%', border: `3px solid ${getColor(log.action)}`,
                    background: '#fff', zIndex: 1,
                  }} />

                  <div className="glass" style={{
                    padding: '18px 22px',
                    borderLeft: `4px solid ${getColor(log.action)}`,
                    transition: 'box-shadow 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = ''}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.4rem' }}>{getIcon(log.action)}</span>
                        <div>
                          <span style={{
                            fontWeight: 700, fontSize: '0.92rem',
                            color: getColor(log.action),
                          }}>
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          {log.user && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 10 }}>
                              · {log.user.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.78rem', color: 'var(--text-muted)',
                        background: 'var(--bg-soft)', padding: '3px 10px', borderRadius: 50,
                        flexShrink: 0,
                      }}>
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {log.details && (
                      <p style={{ margin: '10px 0 0 34px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}
