'use client';
import { useState } from 'react';
import Link from 'next/link';
import '../globals.css';

const LENS_URL = 'https://lens.google.com/';
const LENS_SEARCH_URL =
  'https://lens.google.com/search?ep=gisbubl&hl=en-IN&re=df&p=';

const steps = [
  {
    number: '01',
    icon: '📸',
    title: 'Take a Clear Photo',
    desc: 'Capture a well-lit, close-up photo of the affected leaf, stem, or fruit on your dragon fruit plant.',
  },
  {
    number: '02',
    icon: '🔍',
    title: 'Open Google Lens',
    desc: 'Tap "Open Google Lens" below. On mobile, use the Google app camera icon. On desktop, upload the saved photo.',
  },
  {
    number: '03',
    icon: '🌿',
    title: 'Search & Identify',
    desc: 'Google Lens will identify the plant, disease, or pest and show detailed results, treatments, and related articles.',
  },
];

const tips = [
  { icon: '☀️', text: 'Photograph in natural daylight for best accuracy' },
  { icon: '🔎', text: 'Focus on the most affected area — avoid blurry shots' },
  { icon: '📐', text: 'Include a healthy portion alongside the diseased area' },
  { icon: '🔄', text: 'Try multiple angles if the first scan is unclear' },
];

export default function ScannerPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(LENS_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ background: 'var(--bg-soft)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar scrolled">
        <Link href="/" className="nav-logo">
          Adarsh <span>Dragon Fruit Farm</span>
        </Link>
        <div className="nav-links">
          <Link href="/guide" className="nav-link">Guide</Link>
          <Link href="/marketplace" className="nav-link">Marketplace</Link>
          <Link href="/login" className="nav-link">Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '130px 5% 70px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%',
          width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(66,133,244,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', top: '5%', right: '5%',
          width: '260px', height: '260px',
          background: 'radial-gradient(circle, rgba(46,125,50,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          {/* Google Lens badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(66,133,244,0.1)', border: '1px solid rgba(66,133,244,0.25)',
            borderRadius: '50px', padding: '8px 20px', marginBottom: '28px',
            fontSize: '0.9rem', fontWeight: 600, color: '#4285F4',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#4285F4"/>
              <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="1.5" fill="none"/>
              <path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" stroke="#4285F4" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="12" r="1.5" fill="#4285F4"/>
            </svg>
            Powered by Google Lens
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            lineHeight: 1.15,
            marginBottom: '20px',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
          }}>
            Identify Plant Diseases{' '}
            <span style={{
              background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              with Google Lens
            </span>
          </h1>

          <p style={{
            color: 'var(--text-muted)', fontSize: '1.15rem',
            lineHeight: 1.7, marginBottom: '40px',
          }}>
            Use Google's powerful visual search to instantly detect dragon fruit
            diseases, pests, and deficiencies — right from your camera.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              id="open-google-lens-btn"
              href={LENS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 36px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)',
                color: '#fff', fontWeight: 700, fontSize: '1.05rem',
                textDecoration: 'none', boxShadow: '0 6px 24px rgba(66,133,244,0.35)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(66,133,244,0.45)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(66,133,244,0.35)';
              }}
            >
              {/* Google Lens Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.8" fill="none"/>
                <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" fill="none"/>
                <circle cx="12" cy="12" r="1.5" fill="white"/>
              </svg>
              Open Google Lens
            </a>

            <button
              id="copy-lens-link-btn"
              onClick={handleCopyLink}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 30px', borderRadius: '12px',
                background: copied ? 'rgba(52,168,83,0.12)' : 'rgba(66,133,244,0.08)',
                border: `1.5px solid ${copied ? '#34A853' : 'rgba(66,133,244,0.3)'}`,
                color: copied ? '#34A853' : '#4285F4',
                fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {copied ? '✅ Link Copied!' : '🔗 Copy Lens Link'}
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '20px 5% 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center', fontSize: '2rem',
          fontFamily: 'Outfit, sans-serif', fontWeight: 800,
          marginBottom: '50px',
        }}>
          How to Use Google Lens
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {steps.map((step) => (
            <div
              key={step.number}
              className="glass-panel"
              style={{
                padding: '36px 30px',
                borderRadius: '20px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 50px rgba(66,133,244,0.15)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div style={{
                fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
                color: '#4285F4', marginBottom: '16px',
              }}>
                STEP {step.number}
              </div>
              <div style={{ fontSize: '2.8rem', marginBottom: '16px' }}>{step.icon}</div>
              <h3 style={{
                fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif',
                fontWeight: 700, marginBottom: '12px',
              }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section style={{
        padding: '60px 5% 80px',
        background: 'linear-gradient(135deg, rgba(66,133,244,0.06) 0%, rgba(46,125,50,0.06) 100%)',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center', fontSize: '1.8rem',
            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
            marginBottom: '40px',
          }}>
            Tips for Best Results
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '16px',
          }}>
            {tips.map((tip, i) => (
              <div
                key={i}
                className="glass-panel"
                style={{
                  display: 'flex', alignItems: 'center', gap: '18px',
                  padding: '22px 26px', borderRadius: '14px',
                  borderLeft: '4px solid #4285F4',
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{tip.icon}</span>
                <p style={{ fontWeight: 500, fontSize: '0.97rem', lineHeight: 1.5 }}>
                  {tip.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '70px 5%', textAlign: 'center' }}>
        <div style={{
          maxWidth: '580px', margin: '0 auto',
          background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
          borderRadius: '24px', padding: '56px 40px',
          boxShadow: '0 20px 60px rgba(66,133,244,0.3)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌵</div>
          <h2 style={{
            color: '#fff', fontSize: '2rem',
            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
            marginBottom: '14px',
          }}>
            Ready to Scan Your Plant?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '32px', fontSize: '1.05rem' }}>
            Google Lens works on any device — just point, tap, and discover.
          </p>
          <a
            id="bottom-open-lens-btn"
            href={LENS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 40px', borderRadius: '12px',
              background: '#fff', color: '#4285F4',
              fontWeight: 700, fontSize: '1.05rem',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="1.8" fill="none"/>
              <circle cx="12" cy="12" r="4" stroke="#4285F4" strokeWidth="1.8" fill="none"/>
              <circle cx="12" cy="12" r="1.5" fill="#4285F4"/>
            </svg>
            Launch Google Lens
          </a>
        </div>
      </section>

      {/* Footer note */}
      <div style={{
        textAlign: 'center', padding: '20px', paddingBottom: '40px',
        color: 'var(--text-muted)', fontSize: '0.85rem',
      }}>
        Google Lens is a product of Google LLC — this page links to their service.
      </div>
    </main>
  );
}
