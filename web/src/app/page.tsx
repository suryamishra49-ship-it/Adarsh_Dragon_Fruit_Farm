import Link from 'next/link';

export default function Home() {
  const addressLink = "https://www.google.com/search?q=adarsh+dragon+fruit+pratapgarh&sca_esv=eaaded7228c02422&rlz=1C1MYPO_en-GBIN1173IN1173&biw=1536&bih=695&sxsrf=ANbL-n4lo9vXNZN2xly_dveLlFvpCRsm-g%3A1778417118444&ei=3n0AaprpGuSKnesPrsmnkA4&oq=adarsh+dragon+fruit+farmPrata&gs_lp=Egxnd3Mtd2l6LXNlcnAiHWFkYXJzaCBkcmFnb24gZnJ1aXQgZmFybVByYXRhKgIIADIHECEYChigATIHECEYChigAUjwNlCpB1jZLXABeACQAQCYAdMBoAGFDqoBBjAuMTEuMbgBA8gBAPgBAZgCCqACgAvCAg4QABiABBiKBRiGAxiwA8ICCxAAGIAEGKIEGLADwgIIEAAY7wUYsAPCAgQQIxgnwgIFEAAY7wXCAggQABiABBiiBMICBxAjGLACGCeYAwCIBgGQBgaSBwUxLjguMaAH2j6yBwUwLjguMbgH_ArCBwQwLjEwyAcRgAgB&sclient=gws-wiz-serp";

  return (
    <main>
      <nav className="navbar scrolled">
        <div className="nav-logo">
          Adarsh <span>Dragon Fruit Farm</span>
        </div>
        <div className="nav-links">
          <Link href="/guide" className="nav-link">Guide</Link>
          <Link href="/scanner" className="nav-link">AI Scanner</Link>
          <Link href="/marketplace" className="nav-link">Marketplace</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Professional <br />
            <span className="gradient-text">Dragon Fruit Farming</span>
          </h1>
          <p className="hero-subtitle">
            Leading the way in high-yield dragon fruit cultivation. Join our community of farmers leveraging technology for better harvests.
          </p>
          <div className="hero-actions">
            <Link href="/guide">
              <button className="btn-primary">
                Get Started
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </Link>
            <a href="#appointment">
              <button className="btn-secondary">Visit Our Farm</button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Our Core Services</h2>
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon">🌱</div>
            <h3 className="feature-title">Cultivation Guide</h3>
            <p className="feature-desc">Interactive modules for soil prep, trellising, pruning, and harvesting. Track your progress seamlessly.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">📸</div>
            <h3 className="feature-title">AI Disease Scanner</h3>
            <p className="feature-desc">Our Gemini AI instantly detects diseases from your photos and suggests professional remedies.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">🛒</div>
            <h3 className="feature-title">Marketplace</h3>
            <p className="feature-desc">Buy high-quality cuttings or sell your premium harvest directly to buyers without intermediaries.</p>
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="appointment" className="appointment-section" style={{ padding: '100px 5%', background: 'var(--bg-light)' }}>
        <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px', textAlign: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: '20px' }}>Visit Adarsh Dragon Fruit Farm</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Experience our high-tech cultivation methods firsthand. Book a guided tour of our farm in Pratapgarh.</p>
          <form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', textAlign: 'left' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name</label>
              <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Date</label>
              <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <button className="btn-primary" style={{ gridColumn: '1 / -1', marginTop: '20px' }} type="button">Request Appointment</button>
          </form>
        </div>
      </section>

      {/* Ratings & Reviews */}
      <section className="reviews-section" style={{ padding: '100px 5%', background: 'var(--bg-soft)' }}>
        <h2 className="section-title">Farmer Reviews</h2>
        <div className="features-grid">
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ color: 'var(--accent-yellow)', marginBottom: '15px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"The AI scanner saved my crop last season. Highly recommended for any dragon fruit grower!"</p>
            <div style={{ fontWeight: 'bold' }}>- Ramesh Kumar</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Commercial Farmer</div>
          </div>
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ color: 'var(--accent-yellow)', marginBottom: '15px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"The best place to find high-yield cuttings. The marketplace is transparent and easy to use."</p>
            <div style={{ fontWeight: 'bold' }}>- Sunita Devi</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Home Gardener</div>
          </div>
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ color: 'var(--accent-yellow)', marginBottom: '15px' }}>★★★★☆</div>
            <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"Excellent guide for beginners. The step-by-step approach made it easy to start my own farm."</p>
            <div style={{ fontWeight: 'bold' }}>- Arvind Singh</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aspiring Agri-preneur</div>
          </div>
        </div>
      </section>

      {/* Activity Updates */}
      <section className="activity-section" style={{ padding: '100px 5%', background: 'var(--bg-light)' }}>
        <h2 className="section-title">Latest Farm Activity</h2>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '20px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem' }}>🌿</div>
            <div>
              <h4 style={{ margin: '0' }}>New Pruning Workshop</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Updated our guide with latest techniques for winter pruning to boost spring flowering.</p>
            </div>
          </div>
          <div className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '20px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem' }}>📊</div>
            <div>
              <h4 style={{ margin: '0' }}>Market Analysis Q2</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Demand for organic dragon fruit is up by 25% this quarter. Great news for our sellers!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 5% 40px', background: 'var(--primary-color)', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Adarsh Dragon Fruit Farm</h3>
            <p style={{ opacity: '0.8' }}>Empowering dragon fruit farmers through technology and community.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: '0', opacity: '0.8' }}>
              <li style={{ marginBottom: '10px' }}><Link href="/guide" style={{ color: 'white' }}>Farming Guide</Link></li>
              <li style={{ marginBottom: '10px' }}><Link href="/scanner" style={{ color: 'white' }}>AI Disease Scanner</Link></li>
              <li style={{ marginBottom: '10px' }}><Link href="/marketplace" style={{ color: 'white' }}>Marketplace</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Address</h4>
            <a href={addressLink} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: '0.8', display: 'block', marginBottom: '10px' }}>
              📍 Adarsh Dragon Fruit Farm, Pratapgarh
            </a>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Connect With Us</h4>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                WhatsApp
              </a>
              <a href="#" style={{ color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                YouTube
              </a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', opacity: '0.6', fontSize: '0.9rem' }}>
          © 2026 Adarsh Dragon Fruit Farm. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
