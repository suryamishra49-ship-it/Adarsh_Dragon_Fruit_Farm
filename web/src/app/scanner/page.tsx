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
      const res = await fetch('http://localhost:3001/api/scanner/analyze', {
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
    <main style={{ padding: '100px 5%' }}>
      <nav className="navbar scrolled">
        <Link href="/" className="nav-logo">
          Dragon<span>Solar</span>
        </Link>
      </nav>
      
      <h1 className="section-title">AI Disease Scanner</h1>
      
      <div className="scanner-container">
        <div className="upload-zone glass-panel">
          {!preview ? (
            <div className="upload-prompt">
              <span className="feature-icon" style={{ fontSize: '4rem' }}>📸</span>
              <h3>Upload a Photo</h3>
              <p>Take a clear picture of the dragon fruit or leaf.</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
            </div>
          ) : (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="image-preview" />
              <div className="actions">
                <button className="btn-secondary" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
                  Choose Another
                </button>
                <button className="btn-primary" onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? 'Analyzing with Gemini...' : 'Analyze Image'}
                </button>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="result-zone glass-panel">
            {result.success ? (
              <>
                <h3 className="result-title">Diagnosis Results</h3>
                <div className="diagnosis-box">
                  <p><strong>Status:</strong> {result.diagnosis}</p>
                  <p><strong>AI Confidence:</strong> {(result.confidence * 100).toFixed(0)}%</p>
                </div>
                
                <h4 className="recc-title">Recommendations</h4>
                <ul className="recc-list">
                  {result.recommendations?.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="error-box">
                <p>Error: {result.error || 'Something went wrong'}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .scanner-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .upload-zone {
          padding: 40px;
          text-align: center;
          border: 2px dashed rgba(255, 255, 255, 0.2);
          position: relative;
        }
        .upload-prompt {
          pointer-events: none;
        }
        .file-input {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .image-preview {
          max-width: 100%;
          max-height: 400px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        .result-zone {
          padding: 30px;
          border-left: 4px solid var(--primary-color);
        }
        .result-title {
          font-size: 1.5rem;
          margin-bottom: 16px;
          color: var(--primary-color);
        }
        .diagnosis-box {
          background: rgba(0,0,0,0.3);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .recc-title {
          font-size: 1.2rem;
          margin-bottom: 12px;
        }
        .recc-list {
          padding-left: 20px;
          color: var(--text-light);
        }
        .recc-list li {
          margin-bottom: 8px;
        }
        .error-box {
          color: #ff6b6b;
          font-weight: bold;
        }
      `}</style>
    </main>
  );
}
