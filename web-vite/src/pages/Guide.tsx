import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const API = 'https://adarsh-dragon-fruit-farm.onrender.com';

interface Step { id: number; title: string; description: string; }
interface Progress { stepId: number; status: string; }

export default function Guide() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/guide/steps`).then(r => r.json()),
      fetch(`${API}/api/guide/progress`).then(r => r.json()).catch(() => ({ progress: [] })),
    ]).then(([sd, pd]) => {
      setSteps(sd.steps || []);
      setProgress(pd.progress || []);
      setLoading(false);
    });
  }, []);

  const markComplete = async (stepId: number) => {
    await fetch(`${API}/api/guide/progress/${stepId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    setProgress(prev => [...prev.filter(p => p.stepId !== stepId), { stepId, status: 'COMPLETED' }]);
  };

  const isDone = (id: number) => progress.some(p => p.stepId === id && p.status === 'COMPLETED');
  const doneCount = steps.filter(s => isDone(s.id)).length;

  if (loading) return <div className="loading">Loading guide…</div>;

  return (
    <main className="page" style={{ background: 'var(--bg-soft)' }}>
      <Navbar />
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 14 }}>
            🌱 Interactive <span className="grad-text">Farming Guide</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Step-by-step dragon fruit cultivation — track your progress as you grow.
          </p>

          {/* Progress bar */}
          <div style={{ maxWidth: 400, margin: '24px auto 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--green)' }}>Progress</span>
              <span style={{ color: 'var(--df-pink)' }}>{doneCount} / {steps.length} completed</span>
            </div>
            <div style={{ height: 10, background: '#E8F5E9', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 20,
                background: 'var(--grad-mixed)',
                width: steps.length ? `${(doneCount / steps.length) * 100}%` : '0%',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {steps.map(step => {
            const done = isDone(step.id);
            return (
              <div key={step.id} className="glass" style={{
                padding: '28px 30px',
                borderLeft: `5px solid ${done ? 'var(--green)' : 'var(--df-pink)'}`,
                opacity: done ? 0.8 : 1,
                transition: 'all 0.3s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em',
                      color: done ? 'var(--green)' : 'var(--df-pink)', marginBottom: 8 }}>
                      STEP {String(step.id).padStart(2, '0')}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{step.description}</p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {done ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                        background: 'var(--green-soft)', color: 'var(--green)',
                        padding: '8px 18px', borderRadius: 50, fontWeight: 700, fontSize: '0.88rem' }}>
                        ✓ Done
                      </div>
                    ) : (
                      <button onClick={() => markComplete(step.id)}
                        className="btn btn-green" style={{ fontSize: '0.88rem', padding: '9px 20px' }}>
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
