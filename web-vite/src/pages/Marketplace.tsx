import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const API = 'https://adarsh-dragon-fruit-farm.onrender.com';

interface Product { id: number; name: string; price: number; unit: string; image: string; farmer: string; }

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API}/api/marketplace/products`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.farmer?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading marketplace…</div>;

  return (
    <main className="page" style={{ background: 'var(--bg-soft)' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 14 }}>
            🛒 Farmer's <span className="grad-text">Marketplace</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: 28 }}>
            Buy premium dragon fruit cuttings or sell your harvest — no middlemen.
          </p>
          <input
            className="input"
            placeholder="🔍  Search products or farmers…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 420, margin: '0 auto', display: 'block' }}
          />
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🌵</div>
            <p>No products found.</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(p => (
              <div key={p.id} className="glass"
                style={{ overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}
              >
                <div style={{
                  height: 200, background: p.image ? `url(${p.image}) center/cover` : 'var(--grad-hero)',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', bottom: 12, right: 12,
                    background: 'var(--df-pink)', color: '#fff',
                    borderRadius: 8, padding: '4px 12px', fontSize: '0.85rem', fontWeight: 700,
                  }}>
                    ₹{p.price?.toFixed(2)} / {p.unit}
                  </div>
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 18 }}>
                    by {p.farmer || 'Adarsh Farm'}
                  </p>
                  <button className="btn btn-green" style={{ width: '100%', fontSize: '0.9rem' }}>
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
