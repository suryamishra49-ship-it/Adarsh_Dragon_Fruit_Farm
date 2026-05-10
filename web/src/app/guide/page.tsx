'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../globals.css';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface Progress {
  stepId: number;
  status: string;
}

export default function GuidePage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/api/guide/steps').then(r => r.json()),
      fetch('http://localhost:3001/api/guide/progress').then(r => r.json()).catch(() => ({ progress: [] }))
    ]).then(([stepsData, progressData]) => {
      setSteps(stepsData.steps || []);
      setProgress(progressData.progress || []);
      setLoading(false);
    });
  }, []);

  const markComplete = async (stepId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/guide/progress/${stepId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      const data = await res.json();
      if (data.success) {
        setProgress(prev => {
          const filtered = prev.filter(p => p.stepId !== stepId);
          return [...filtered, { stepId, status: 'COMPLETED' }];
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isCompleted = (stepId: number) => {
    return progress.some(p => p.stepId === stepId && p.status === 'COMPLETED');
  };

  if (loading) return <div className="loading-state">Loading guide...</div>;

  return (
    <main style={{ padding: '100px 5%' }}>
      <nav className="navbar scrolled">
        <Link href="/" className="nav-logo">
          Dragon<span>Solar</span>
        </Link>
      </nav>
      
      <h1 className="section-title">Interactive Farming Guide</h1>
      
      <div className="timeline-container">
        {steps.map((step) => {
          const completed = isCompleted(step.id);
          return (
            <div key={step.id} className={`timeline-item glass-panel ${completed ? 'completed' : ''}`}>
              <div className="timeline-content">
                <h3 className="feature-title">{step.id}. {step.title}</h3>
                <p className="feature-desc">{step.description}</p>
                {!completed ? (
                  <button className="btn-primary" onClick={() => markComplete(step.id)} style={{ marginTop: 16 }}>
                    Mark Complete
                  </button>
                ) : (
                  <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold', display: 'block', marginTop: 16 }}>
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .loading-state {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--text-muted);
        }
        .timeline-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .timeline-item {
          padding: 30px;
          border-left: 4px solid var(--primary-color);
          transition: all 0.3s ease;
        }
        .timeline-item.completed {
          border-left-color: var(--secondary-color);
          opacity: 0.8;
        }
      `}</style>
    </main>
  );
}
