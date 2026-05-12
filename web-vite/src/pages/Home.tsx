import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API = 'https://adarsh-dragon-fruit-farm.onrender.com';
const addressLink = 'https://www.google.com/search?q=adarsh+dragon+fruit+pratapgarh';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [bookMsg, setBookMsg] = useState('');

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem('user') || 'null')); } catch {}
  }, []);

  const bookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setBookMsg('Please login to book an appointment.'); return; }
    try {
      const res = await fetch(`${API}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId: user.id, date, purpose }),
      });
      const data = await res.json();
      setBookMsg(data.success ? '✅ Request sent! Check your dashboard.' : '❌ Failed. Please try again.');
      if (data.success) { setDate(''); setPurpose(''); }
    } catch {
      setBookMsg('❌ Connection error.');
    }
  };

  return (
    <main>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        background: 'var(--grad-hero)',
        display: 'flex', alignItems: 'center',
        padding: '0 5%', position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        {[
          { size: 500, top: '-15%', right: '-10%', opacity: 0.12 },
          { size: 300, bottom: '-10%', left: '-5%', opacity: 0.1 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: c.size, height: c.size,
            borderRadius: '50%', background: 'rgba(255,255,255,' + c.opacity + ')',
            top: (c as any).top, right: (c as any).right,
            bottom: (c as any).bottom, left: (c as any).left,
            filter: 'blur(60px)',
          }} />
        ))}

        <div style={{ maxWidth: 640, zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 50, padding: '7px 18px', marginBottom: 24,
            fontSize: '0.85rem', fontWeight: 600, color: '#fff',
            backdropFilter: 'blur(8px)',
          }}>
            🌵 Premium Dragon Fruit Farm — Pratapgarh
          </div>
          <h1 style={{
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
            lineHeight: 1.1, color: '#fff', marginBottom: 24,
          }}>
            Dragon Fruit<br />
            <span style={{ color: '#FFD54F' }}>Farming</span> Reimagined
          </h1>
          <p style={{
            fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.75, marginBottom: 40, maxWidth: 520,
          }}>
            High-yield cultivation, smart disease detection with Google Lens,
            and a direct marketplace — all for dragon fruit farmers.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/guide" className="btn btn-ghost" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              🌱 Start Growing
            </Link>
            <a href="#appointment" className="btn" style={{
              background: 'var(--df-pink)', color: '#fff', fontSize: '1rem', padding: '14px 32px',
              boxShadow: '0 6px 24px rgba(233,30,140,0.4)',
            }}>
              📅 Visit Our Farm
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 5%', background: 'var(--bg-soft)' }}>
        <h2 className="section-title">Our Core Services</h2>
        <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {[
            { to: '/guide', icon: '🌱', title: 'Cultivation Guide',
              desc: 'Interactive modules — soil prep, trellising, pruning, harvesting. Track every step.' },
            { to: '/scanner', icon: '🔍', title: 'Google Lens Scanner',
              desc: 'Snap a photo and use Google Lens to instantly identify diseases, pests, and deficiencies.' },
            { to: '/marketplace', icon: '🛒', title: 'Marketplace',
              desc: 'Buy high-quality cuttings or sell your harvest directly — no middlemen.' },
          ].map(f => (
            <Link
              key={f.to} to={f.to}
              className="glass"
              style={{
                display: 'block', padding: '40px 30px', textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s', textDecoration: 'none',
                borderTop: '3px solid var(--df-pink)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-10px)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 14 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── APPOINTMENT ── */}
      <section id="appointment" style={{ padding: '100px 5%', background: '#fff' }}>
        <div className="glass" style={{ maxWidth: 800, margin: '0 auto', padding: '60px 50px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 12, textAlign: 'center' }}>
            Visit <span className="grad-text">Adarsh Dragon Fruit Farm</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 40, textAlign: 'center' }}>
            Book a guided tour of our farm in Pratapgarh. Experience high-tech cultivation firsthand.
          </p>

          {bookMsg && (
            <div className={`alert ${bookMsg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}
              style={{ marginBottom: 24, textAlign: 'center' }}>
              {bookMsg}
            </div>
          )}

          <form onSubmit={bookAppointment} style={{ display: 'grid', gap: 20 }}>
            <div className="grid-2">
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Purpose of Visit</label>
                <input className="input" placeholder="e.g. Purchase cuttings, Learn pruning"
                  value={purpose} onChange={e => setPurpose(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Preferred Date</label>
                <input className="input" type="date" value={date}
                  onChange={e => setDate(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-pink" style={{ width: '100%', padding: 15, fontSize: '1rem' }}>
              Request Appointment
            </button>
          </form>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding: '100px 5%', background: 'var(--bg-soft)' }}>
        <h2 className="section-title">Farmer Reviews</h2>
        <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {[
            { stars: 5, text: '"The Google Lens scanner saved my crop last season. Highly recommended!"', name: 'Ramesh Kumar', role: 'Commercial Farmer' },
            { stars: 5, text: '"Best place for high-yield cuttings. The marketplace is transparent and easy to use."', name: 'Sunita Devi', role: 'Home Gardener' },
            { stars: 4, text: '"Excellent guide for beginners. Step-by-step approach made it easy to start my farm."', name: 'Arvind Singh', role: 'Aspiring Agri-preneur' },
          ].map((r, i) => (
            <div key={i} className="glass" style={{ padding: '32px 28px' }}>
              <div style={{ color: 'var(--accent-gold)', marginBottom: 14, fontSize: '1.1rem' }}>
                {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: 20, lineHeight: 1.7, color: 'var(--text-muted)' }}>
                {r.text}
              </p>
              <div style={{ fontWeight: 700 }}>{r.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section style={{ padding: '100px 5%', background: '#fff' }}>
        <h2 className="section-title">Farm Gallery</h2>
        <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {[
            { src: '/images/plant.png', alt: 'Dragon Fruit Plant' },
            { src: '/images/closeup.png', alt: 'Dragon Fruit Close-up' },
            { src: '/images/harvest.png', alt: 'Dragon Fruit Harvest' },
          ].map((img, i) => (
            <div key={i} className="glass" style={{ overflow: 'hidden', height: 280, borderRadius: 16 }}>
              <img src={img.src} alt={img.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--green-dark)', color: '#fff', padding: '80px 5% 40px' }}>
        <div className="grid-3" style={{ marginBottom: 60 }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: 16 }}>Adarsh Dragon Fruit Farm</h3>
            <p style={{ opacity: 0.8, lineHeight: 1.7 }}>
              Empowering dragon fruit farmers through technology and community.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: 16 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', opacity: 0.8, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link to="/guide" style={{ color: '#fff' }}>Farming Guide</Link></li>
              <li><Link to="/scanner" style={{ color: '#fff' }}>Lens Scanner</Link></li>
              <li><Link to="/marketplace" style={{ color: '#fff' }}>Marketplace</Link></li>
              <li><Link to="/history" style={{ color: '#fff' }}>Activity History</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: 16 }}>Connect With Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.85 }}>
              <a href="https://wa.me/+919628984643" target="_blank" rel="noreferrer" style={{ color: '#fff' }}>💬 WhatsApp: 9628984643</a>
              <a href="https://wa.me/+919565435834" target="_blank" rel="noreferrer" style={{ color: '#fff' }}>💬 WhatsApp: 9565435834</a>
              <a href="https://www.youtube.com/@adarshdragonfruitfarm" target="_blank" rel="noreferrer" style={{ color: '#fff' }}>📺 YouTube Channel</a>
              <a href={addressLink} target="_blank" rel="noreferrer" style={{ color: '#fff' }}>📍 Pratapgarh, UP</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 30, textAlign: 'center', opacity: 0.6, fontSize: '0.88rem' }}>
          © 2026 Adarsh Dragon Fruit Farm. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
