import { useState } from 'react';
import Navbar from '../components/Navbar';

const LENS_URL = 'https://lens.google.com/';

const steps = [
  { number: '01', icon: '📸', title: 'Take a Clear Photo', desc: 'Capture a well-lit, close-up photo of the affected leaf, stem, or fruit on your dragon fruit plant.' },
  { number: '02', icon: '🔍', title: 'Open Google Lens', desc: 'Tap "Open Google Lens" below. On mobile, use the Google app camera icon. On desktop, upload your saved photo.' },
  { number: '03', icon: '🌿', title: 'Search & Identify', desc: 'Google Lens identifies the disease, pest, or deficiency — with detailed remedies and related articles.' },
];

const tips = [
  { icon: '☀️', text: 'Photograph in natural daylight for best accuracy' },
  { icon: '🔎', text: 'Focus on the most affected area — avoid blurry shots' },
  { icon: '📐', text: 'Include a healthy portion alongside the diseased area' },
  { icon: '🔄', text: 'Try multiple angles if the first scan is unclear' },
];

export default function Scanner() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(LENS_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ background: 'var(--bg-soft)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '130px 5% 70px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(46,125,50,0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: 260, height: 260,
          background: 'radial-gradient(circle, rgba(233,30,140,0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(66,133,244,0.1)', border: '1px solid rgba(66,133,244,0.25)',
            borderRadius: 50, padding: '8px 20px', marginBottom: 28,
            fontSize: '0.9rem', fontWeight: 600, color: '#4285F4',
          }}>
            🔍 Powered by Google Lens
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.15, marginBottom: 20 }}>
            Identify Plant Diseases{' '}
            <span className="grad-text">with Google Lens</span>
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            Use Google's powerful visual search to instantly detect dragon fruit diseases, pests, and deficiencies.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={LENS_URL} target="_blank" rel="noopener noreferrer"
              className="btn" style={{
                background: 'linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)',
                color: '#fff', padding: '16px 36px', fontSize: '1.05rem',
                boxShadow: '0 6px 24px rgba(66,133,244,0.35)',
              }}>
              🔍 Open Google Lens
            </a>
            <button onClick={copyLink} className="btn btn-outline"
              style={{
                padding: '16px 30px', fontSize: '1rem',
                color: copied ? 'var(--green)' : undefined,
                borderColor: copied ? 'var(--green)' : undefined,
              }}>
              {copied ? '✅ Copied!' : '🔗 Copy Link'}
            </button>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '20px 5% 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 className="section-title">How to Use Google Lens</h2>
        <div className="grid-3">
          {steps.map(s => (
            <div key={s.number} className="glass" style={{ padding: '36px 28px', borderTop: '4px solid var(--df-pink)', transition: 'transform 0.3s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--df-pink)', marginBottom: 16 }}>STEP {s.number}</div>
              <div style={{ fontSize: '2.8rem', marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section style={{ padding: '60px 5% 80px', background: 'linear-gradient(135deg, var(--green-soft) 0%, var(--df-pink-soft) 100%)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 className="section-title">Tips for Best Results</h2>
          <div className="grid-2">
            {tips.map((t, i) => (
              <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', gap: 18,
                padding: '22px 26px', borderLeft: '4px solid var(--green)' }}>
                <span style={{ fontSize: '1.8rem' }}>{t.icon}</span>
                <p style={{ fontWeight: 500, fontSize: '0.97rem', lineHeight: 1.5, margin: 0 }}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '70px 5%', textAlign: 'center' }}>
        <div style={{
          maxWidth: 560, margin: '0 auto',
          background: 'var(--grad-mixed)',
          borderRadius: 24, padding: '56px 40px',
          boxShadow: '0 20px 60px rgba(46,125,50,0.3)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🌵</div>
          <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: 14 }}>Ready to Scan Your Plant?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 32, fontSize: '1.05rem' }}>
            Google Lens works on any device — just point, tap, and discover.
          </p>
          <a href={LENS_URL} target="_blank" rel="noopener noreferrer"
            className="btn" style={{ background: '#fff', color: 'var(--green)', fontWeight: 700, fontSize: '1.05rem', padding: '15px 40px' }}>
            🔍 Launch Google Lens
          </a>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '16px 0 40px', color: 'var(--text-muted)', fontSize: '0.83rem' }}>
        Google Lens is a product of Google LLC — this page links to their service.
      </div>
    </main>
  );
}
