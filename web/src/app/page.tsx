import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <div className="nav-logo">
          Dragon<span>Solar</span>
        </div>
        <div className="nav-links">
          <Link href="/guide" className="nav-link">Interactive Guide</Link>
          <Link href="/scanner" className="nav-link">AI Scanner</Link>
          <Link href="/marketplace" className="nav-link">Marketplace</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Master the Art of <br />
            <span className="gradient-text">Dragon Fruit Farming</span>
          </h1>
          <p className="hero-subtitle">
            From soil preparation to harvest, leverage AI-driven insights and a community marketplace to maximize your yield and profits.
          </p>
          <div className="hero-actions">
            <Link href="/guide">
              <button className="btn-primary">
                Start Farming Guide
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </Link>
            <Link href="/marketplace">
              <button className="btn-secondary">Explore Marketplace</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Everything You Need to Succeed</h2>
        <div className="features-grid">
          
          <div className="feature-card glass-panel">
            <div className="feature-icon">🌱</div>
            <h3 className="feature-title">Step-by-Step Guide</h3>
            <p className="feature-desc">Interactive modules guiding you through soil prep, trellising, pruning, and harvesting. Track your progress seamlessly.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon">📸</div>
            <h3 className="feature-title">AI Disease Scanner</h3>
            <p className="feature-desc">Upload a photo of your dragon fruit or leaves. Our Gemini AI instantly detects diseases and suggests remedies.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon">🛒</div>
            <h3 className="feature-title">Farmer's Marketplace</h3>
            <p className="feature-desc">Buy high-quality cuttings or sell your premium harvest directly to buyers without intermediaries.</p>
          </div>

        </div>
      </section>
    </main>
  );
}
