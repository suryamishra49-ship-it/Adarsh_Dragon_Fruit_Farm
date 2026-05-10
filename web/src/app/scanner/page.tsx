'use client';
import { useState } from 'react';
import Link from 'next/link';
import '../globals.css';

const GEMINI_API_KEY = 'AIzaSyCNMG0kYscQdSXrDEgs16lsAoCY6N9MCVE';

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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);

    try {
      const base64Image = await fileToBase64(file);
      const mimeType = file.type;

      const prompt = `You are an expert plant pathologist specializing in Dragon Fruit (Pitaya) farming.
Analyze this image of a dragon fruit plant/fruit.
1. Identify any visible diseases or pests (e.g., Anthracnose, Stem Rot, Mealybugs, Canker, etc.).
2. If healthy, say "Healthy Plant - No diseases detected."
3. Provide a confidence score between 0.0 and 1.0.
4. Provide 2-3 short, actionable recommendations for treatment or care.
Return the response STRICTLY as a valid JSON object like this:
{
  "diagnosis": "Short description of disease or health status",
  "confidence": 0.95,
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Image
                  }
                }
              ]
            }]
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(text);
      setResult({ success: true, ...parsed });
    } catch (err: any) {
      console.error(err);
      setResult({ success: false, error: err.message || 'Failed to analyze image' });
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
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🔬</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>AI Disease Scanner</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Upload a photo of your dragon fruit plant for instant Gemini AI diagnosis and expert remedies.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="glass-panel" style={{
          border: `2px dashed ${preview ? 'var(--primary-color)' : 'rgba(46, 125, 50, 0.3)'}`,
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          {!preview ? (
            <label style={{ cursor: 'pointer', display: 'block', padding: '80px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📸</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Click to Upload a Photo</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Supports JPG, PNG, HEIC — take a clear photo of the plant or fruit</p>
              <span className="btn-primary" style={{ display: 'inline-block', padding: '12px 30px' }}>
                Choose Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '450px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '25px' }}
              />
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <label style={{ cursor: 'pointer' }}>
                  <span className="btn-secondary" style={{ display: 'inline-block' }}>Choose Another</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
                <button
                  className="btn-primary"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  style={{ minWidth: '200px' }}
                >
                  {analyzing ? (
                    <>⏳ Analyzing with Gemini AI...</>
                  ) : (
                    <>🔍 Analyze Image Now</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="glass-panel" style={{
            padding: '40px',
            marginTop: '30px',
            borderLeft: '6px solid var(--primary-color)',
            borderRadius: '20px'
          }}>
            {result.success ? (
              <>
                <h3 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', marginBottom: '25px' }}>
                  🩺 AI Diagnosis Results
                </h3>
                <div style={{ background: '#f0f7f0', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                  <p style={{ fontSize: '1.15rem', marginBottom: '12px' }}>
                    <strong>Status:</strong> {result.diagnosis}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong>AI Confidence:</strong>
                    <div style={{ flex: 1, background: '#ddd', borderRadius: '20px', height: '10px', maxWidth: '200px' }}>
                      <div style={{
                        width: `${(result.confidence * 100).toFixed(0)}%`,
                        background: 'var(--gradient-primary)',
                        height: '100%',
                        borderRadius: '20px',
                        transition: 'width 1s ease'
                      }} />
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>✅ Expert Recommendations</h4>
                <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.9' }}>
                  {result.recommendations?.map((r: string, i: number) => (
                    <li key={i} style={{
                      padding: '12px 15px',
                      marginBottom: '10px',
                      background: '#f9f9f9',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--secondary-color)'
                    }}>
                      {r}
                    </li>
                  ))}
                </ul>

                <button
                  className="btn-secondary"
                  style={{ marginTop: '20px' }}
                  onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                >
                  Scan Another Plant
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#d32f2f' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                  ⚠️ Error: {result.error || 'Something went wrong'}
                </p>
                <button className="btn-secondary" onClick={() => setResult(null)}>Try Again</button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
