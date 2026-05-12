import { useState } from 'react';
import { Camera, Search, CheckCircle2, AlertCircle, Copy } from 'lucide-react';

export default function Scanner() {
  const [copied, setCopied] = useState(false);
  const LENS_URL = 'https://lens.google.com/';

  const copyLink = () => {
    navigator.clipboard.writeText(LENS_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { id: '01', title: 'Take a Photo', desc: 'Capture a well-lit, close-up photo of the affected plant part.', icon: <Camera /> },
    { id: '02', title: 'Open Google Lens', desc: 'Tap the button below to launch the visual search tool.', icon: <Search /> },
    { id: '03', title: 'Get Remedies', desc: 'Identify the issue and find natural remedies instantly.', icon: <CheckCircle2 /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-pink-white opacity-90 -z-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold text-xs mb-8 uppercase tracking-widest">
            <Search size={14} />
            <span>AI-Powered Plant Diagnosis</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
            AI Doctor <br />
            <span className="text-gray-800">Lens Scanner</span>
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed">
            Use the power of visual search to instantly identify dragon fruit diseases, pests, and nutrient deficiencies. Powered by Google Lens.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href={LENS_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary py-5 px-10 text-xl shadow-2xl shadow-cactus/30 flex items-center justify-center space-x-3"
            >
              <Search size={24} />
              <span>Launch AI Scanner</span>
            </a>
            <button 
              onClick={copyLink}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 py-5 px-10 rounded-full font-bold text-xl transition-all flex items-center justify-center space-x-3"
            >
              {copied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
              <span>{copied ? 'Copied URL!' : 'Share Tool'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.id} className="relative group">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 relative z-10">
                  <div className="text-pitaya font-black text-6xl opacity-10 absolute top-6 right-8 group-hover:scale-110 transition-transform">
                    {step.id}
                  </div>
                  <div className="bg-pink-50 p-4 rounded-2xl text-pitaya inline-block mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cactus/10 rounded-full blur-[120px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-12">
              <div className="h-px flex-grow bg-white/20"></div>
              <h2 className="text-3xl font-black">Pro Tips for Accuracy</h2>
              <div className="h-px flex-grow bg-white/20"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TipItem text="Photograph in natural daylight for best color accuracy." />
              <TipItem text="Focus on the transition between healthy and affected areas." />
              <TipItem text="Avoid blurry shots — use 'Macro' mode if your phone has it." />
              <TipItem text="Clean the lens before taking the photo for maximum clarity." />
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center space-x-2 text-gray-400 text-sm bg-white px-4 py-2 rounded-full border border-gray-100">
          <AlertCircle size={14} />
          <span>Note: AI diagnosis is for guidance. Consult a specialist for severe cases.</span>
        </div>
      </div>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start space-x-4">
      <div className="bg-cactus/20 p-2 rounded-lg mt-1 text-cactus">
        <CheckCircle2 size={18} />
      </div>
      <p className="text-gray-300 font-medium">{text}</p>
    </div>
  );
}
