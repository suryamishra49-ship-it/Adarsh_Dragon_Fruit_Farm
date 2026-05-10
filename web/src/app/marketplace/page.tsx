'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../globals.css';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  farmer: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/marketplace/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-state">Loading marketplace...</div>;

  return (
    <main style={{ padding: '100px 5%' }}>
      <nav className="navbar scrolled">
        <Link href="/" className="nav-logo">
          Dragon<span>Solar</span>
        </Link>
      </nav>
      
      <h1 className="section-title">Farmer's Marketplace</h1>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card glass-panel">
            <div 
              className="product-image" 
              style={{ backgroundImage: `url(${product.image})`, backgroundColor: 'rgba(255,255,255,0.1)' }}
            />
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-farmer">by {product.farmer}</p>
              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)} / {product.unit}</span>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
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
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .product-card {
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-8px);
        }
        .product-image {
          height: 200px;
          background-size: cover;
          background-position: center;
        }
        .product-details {
          padding: 20px;
        }
        .product-name {
          font-size: 1.2rem;
          margin-bottom: 4px;
        }
        .product-farmer {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 16px;
        }
        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .product-price {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--primary-color);
        }
      `}</style>
    </main>
  );
}
