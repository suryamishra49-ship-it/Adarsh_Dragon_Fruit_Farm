'use client';
import { useState } from 'react';
import Link from 'next/link';
import '../globals.css';

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('https://adarsh-dragon-fruit-farm.onrender.com/api/scanner/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult({ success: false, error: 'Failed to connect to server' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main style={{ padding: '120px 5% 60px', background: 'var(--bg-soft)', minHeight: '100vh' }}>
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
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>AI Disease Scanner</h1>
          <p style={{ color: 'var(--text-muted)' }}>Upload a photo of your dragon fruit plant for instant AI diagnosis and remedies.</p>
        </div>
        
        <div className="scanner-container">
          <div className="upload-zone glass-panel">
            {!preview ? (
              <label className="upload-label" style={{ cursor: 'pointer', display: 'block', padding: '60px' }}>
                <div className="upload-prompt">
                  <span className="feature-icon" style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>📸</span>
                  <h3 style={{ marginBottom: '10px' }}>Upload a Photo</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Click here or take a clear picture of the dragon fruit or leaf.</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
              </label>
            ) : (
              <div className="preview-container" style={{ padding: '30px' }}>
                <img src={preview} alt="Preview" className="image-preview" />
                <div className="actions" style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <button className="btn-secondary" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
                    Choose Another
                  </button>
                  <button className="btn-primary" onClick={handleAnalyze} disabled={analyzing}>
                    {analyzing ? 'Analyzing with Gemini AI...' : 'Analyze Image Now'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="result-zone glass-panel" style={{ padding: '40px', marginTop: '30px', borderLeft: '6px solid var(--primary-color)' }}>
              {result.success ? (
                <>
                  <h3 className="result-title" style={{ color: 'var(--primary-color)', marginBottom: '25px', fontSize: '1.8rem' }}>AI Diagnosis Results</h3>
                  <div className="diagnosis-box" style={{ background: '#f0f7f0', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}><strong>Status:</strong> {result.diagnosis}</p>
                    <p style={{ color: 'var(--text-muted)' }}><strong>AI Confidence:</strong> {(result.confidence * 100).toFixed(0)}%</p>
                  </div>
                  
                  <h4 className="recc-title" style={{ marginBottom: '15px', fontSize: '1.3rem' }}>Expert Recommendations</h4>
                  <ul className="recc-list" style={{ lineHeight: '1.8' }}>
                    {result.recommendations?.map((r: string, i: number) => (
                      <li key={i} style={{ marginBottom: '10px' }}>{r}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="error-box" style={{ color: '#d32f2f', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem' }}>Error: {result.error || 'Something went wrong'}</p>
                  <button className="btn-secondary" style={{ marginTop: '15px' }} onClick={() => setResult(null)}>Try Again</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .upload-zone {
          transition: all 0.3s ease;
          border: 2px dashed rgba(46, 125, 50, 0.2);
        }
        .upload-zone:hover {
          border-color: var(--primary-color);
          background: rgba(46, 125, 50, 0.02);
          transform: translateY(-2px);
        }
        .image-preview {
          max-width: 100%;
          max-height: 450px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .recc-list {
          list-style: none;
          padding: 0;
        }
        .recc-list li::before {
          content: "✅";
          margin-right: 10px;
        }
      `}</style>
    </main>
  );
}
