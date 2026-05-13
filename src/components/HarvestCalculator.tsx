import { useState, useEffect } from 'react';
import { addDays, format, differenceInDays } from 'date-fns';
import { Calendar, Clock, Sparkles, Sprout, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HarvestCalculator() {
  const [floweringDate, setFloweringDate] = useState<string>('');
  const [result, setResult] = useState<{ start: Date; end: Date; daysRemaining: number } | null>(null);

  useEffect(() => {
    if (floweringDate) {
      const date = new Date(floweringDate);
      const start = addDays(date, 30);
      const end = addDays(date, 35);
      const today = new Date();
      
      // Calculate days remaining until the START of the harvest window
      const remaining = differenceInDays(start, today);
      
      setResult({
        start,
        end,
        daysRemaining: remaining > 0 ? remaining : 0
      });
    } else {
      setResult(null);
    }
  }, [floweringDate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-farm-green to-cactus p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Harvest Predictor</h2>
          </div>
          <p className="text-soft-green/90 text-sm">
            Track your dragon fruit's journey from flower to fruit.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Input Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pitaya" />
              When did it bloom? (Flowering Date)
            </label>
            <div className="relative group">
              <input
                type="date"
                value={floweringDate}
                onChange={(e) => setFloweringDate(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-cactus/20 focus:border-cactus outline-none transition-all text-lg font-medium group-hover:border-gray-200"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Result Window */}
                <div className="bg-gradient-to-br from-soft-green/50 to-white border-2 border-cactus/20 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-20 h-20 text-cactus" />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-cactus font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-cactus rounded-full animate-pulse" />
                      Predicted Harvest Window
                    </h3>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Starts Around</p>
                        <p className="text-2xl font-black text-gray-900">
                          {format(result.start, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="hidden md:block w-px h-12 bg-gray-200" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Ends Around</p>
                        <p className="text-2xl font-black text-gray-900">
                          {format(result.end, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Countdown Section */}
                {result.daysRemaining > 0 ? (
                  <div className="bg-pitaya rounded-3xl p-6 text-white shadow-xl shadow-pitaya/20 relative overflow-hidden">
                    <div className="absolute -bottom-4 -right-4 opacity-20">
                      <Clock className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-pitaya-100 text-sm font-medium mb-1 uppercase tracking-widest">Patience is key</p>
                        <h4 className="text-4xl font-black flex items-baseline gap-2">
                          {result.daysRemaining}
                          <span className="text-lg font-normal opacity-80">Days Left</span>
                        </h4>
                      </div>
                      <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                        <Clock className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-cactus rounded-3xl p-6 text-white shadow-xl shadow-cactus/20 flex items-center justify-between">
                    <div>
                      <p className="text-soft-green text-sm font-medium mb-1 uppercase tracking-widest">Ready for picking!</p>
                      <h4 className="text-3xl font-black">Time to Harvest! 🐉</h4>
                    </div>
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                      <Sparkles className="w-8 h-8" />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl text-sm border border-blue-100">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>
                    Dragon fruits typically ripen 30 to 35 days after flowering. Factors like temperature and sunlight can slightly shift this window.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">Select a flowering date to see the prediction</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
