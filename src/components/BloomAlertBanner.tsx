import { useState, useEffect } from 'react';
import { Sparkles, Moon, X, Bell, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BloomAlertBanner() {
  // Mock weather data - in a real app, fetch this from a weather API
  const [weather] = useState({ temp: 27.5, humidity: 88 });
  const [isVisible, setIsVisible] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const isBloomLikely = weather.temp >= 24 && weather.temp <= 30 && weather.humidity > 80;

  const handleTriggerAlert = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/bloom-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: weather.temp,
          humidity: weather.humidity,
          subscribers: ['surya.mishra49@gmail.com', 'test@example.com']
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('idle');
      }
    } catch (error) {
      console.error('Bloom Alert Error:', error);
      setStatus('idle');
    }
  };

  return (
    <AnimatePresence>
      {isBloomLikely && isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative bg-gradient-to-r from-pitaya via-[#ff4d8d] to-pitaya border-b border-white/20 z-[100]"
        >
          <div className="container mx-auto px-6 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-full animate-pulse">
                  <Moon className="w-4 h-4 fill-white" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                  <span className="font-black text-sm uppercase tracking-tighter">Live Farm Status:</span>
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Night-bloom likely tonight! ({weather.temp}°C, {weather.humidity}% Humid)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleTriggerAlert}
                  disabled={status !== 'idle'}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    status === 'success' 
                    ? 'bg-green-400 text-white' 
                    : 'bg-white text-pitaya hover:scale-105 active:scale-95 shadow-lg shadow-black/10'
                  }`}
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : status === 'success' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Bell className="w-3 h-3" />
                  )}
                  {status === 'success' ? 'Alerts Sent' : 'Broadcast Alert'}
                </button>
                
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Decorative background sparkle */}
          <div className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
