import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Filter, ArrowUpDown, ChevronRight } from 'lucide-react';

interface Variety {
  id: string;
  name: string;
  fleshColor: string;
  skinColor: string;
  brix: number;
  description: string;
  image: string;
}

const VARIETIES: Variety[] = [
  {
    id: 'american-beauty',
    name: 'American Beauty',
    fleshColor: 'Magenta',
    skinColor: 'Red',
    brix: 19,
    description: 'Deep magenta flesh with a rich, berry-like flavor profile.',
    image: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=800'
  },
  {
    id: 'physical-graffiti',
    name: 'Physical Graffiti',
    fleshColor: 'Pink',
    skinColor: 'Red',
    brix: 17,
    description: 'Beautiful pink flesh with a perfect balance of sweet and tangy.',
    image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800'
  },
  {
    id: 'palora-yellow',
    name: 'Palora Yellow',
    fleshColor: 'White',
    skinColor: 'Yellow',
    brix: 22,
    description: 'The world\'s sweetest dragon fruit variety from Ecuador.',
    image: 'https://images.unsplash.com/photo-1550258114-189a79444811?w=800'
  },
  {
    id: 'vietnamese-white',
    name: 'Vietnamese White',
    fleshColor: 'White',
    skinColor: 'Pink',
    brix: 14,
    description: 'The standard commercial variety, crisp and refreshing.',
    image: 'https://images.unsplash.com/photo-1620127252536-03bdfcf6d5c3?w=800'
  },
  {
    id: 'dark-star',
    name: 'Dark Star',
    fleshColor: 'Magenta',
    skinColor: 'Red',
    brix: 18,
    description: 'Medium-large fruit with a very grape-like sweetness.',
    image: 'https://images.unsplash.com/photo-1621506289937-9ccc14d599d0?w=800'
  },
  {
    id: 'sugar-dragon',
    name: 'Sugar Dragon',
    fleshColor: 'Red',
    skinColor: 'Red',
    brix: 20,
    description: 'Small but incredibly sweet fruit, often used for cross-pollination.',
    image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=800'
  }
];

export default function VarietyGallery() {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'brix' | 'name'>('name');

  const fleshColors = ['All', ...Array.from(new Set(VARIETIES.map(v => v.fleshColor)))];

  const filteredVarieties = useMemo(() => {
    let result = VARIETIES.filter(v => filter === 'All' || v.fleshColor === filter);
    
    result.sort((a, b) => {
      if (sortBy === 'brix') return b.brix - a.brix;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [filter, sortBy]);

  return (
    <div className="space-y-12">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400 mr-2">
            <Filter size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Flesh Color</span>
          </div>
          {fleshColors.map(color => (
            <button
              key={color}
              onClick={() => setFilter(color)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                filter === color 
                ? 'bg-cactus text-white shadow-lg shadow-cactus/20' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {color}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
          <div className="flex items-center gap-2 text-gray-400">
            <ArrowUpDown size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Sort By</span>
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'brix' | 'name')}
            className="bg-transparent font-bold text-gray-900 outline-none cursor-pointer"
          >
            <option value="name">Name (A-Z)</option>
            <option value="brix">Sweetness (Brix)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredVarieties.map((variety) => (
            <motion.div
              layout
              key={variety.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={variety.image} 
                  alt={variety.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: variety.fleshColor.toLowerCase() === 'white' ? '#ddd' : variety.fleshColor.toLowerCase() }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{variety.fleshColor} Flesh</span>
                  </div>
                </div>
                
                {/* Brix Overlay */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-cactus/95 backdrop-blur-md p-4 rounded-2xl text-white flex justify-between items-center shadow-2xl">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Sugar Rating</p>
                      <p className="text-xl font-black">{variety.brix}° Brix</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={12} 
                          fill={star <= Math.round(variety.brix / 4) ? 'white' : 'none'} 
                          className={star <= Math.round(variety.brix / 4) ? 'text-white' : 'text-white/30'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-cactus transition-colors">
                    {variety.name}
                  </h3>
                </div>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
                  {variety.description}
                </p>

                <div className="flex items-center gap-4">
                  <a 
                    href="/marketplace"
                    className="flex-grow bg-gray-900 text-white py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-cactus transition-all group/btn"
                  >
                    <ShoppingCart size={18} />
                    <span>Buy Cuttings</span>
                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                  <div className="bg-gray-50 p-4 rounded-2xl text-gray-400">
                    <Star size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
