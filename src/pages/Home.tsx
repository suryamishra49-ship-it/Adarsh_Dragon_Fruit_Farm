import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Star, ShoppingCart, 
  Calendar, ShieldCheck, Heart, Leaf, Sprout,
  Activity, ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import HarvestCalculator from '../components/HarvestCalculator';

interface JournalEntry {
  id: number;
  title: string;
  description: string;
  tag: 'Harvest' | 'Bloom Alert' | 'Farm Tour' | 'Organic Practice';
  date: string;
  image: string;
  likes: number;
}

export default function Home() {
  const [latestActivities, setLatestActivities] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const defaultJournal: JournalEntry[] = [
      {
        id: 1,
        title: 'Bumper Summer Harvest',
        description: 'Successfully harvested 140kg of premium American Beauty & Palora Yellow dragon fruits today! Sweetness levels hit record highs.',
        tag: 'Harvest',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        image: '/images/red_fruit.png',
        likes: 42
      },
      {
        id: 2,
        title: 'Midnight Bloom Spectacle',
        description: 'American Beauty flowers opened fully tonight! Over 300 massive white blossoms illuminated the twilight. A spectacular sight.',
        tag: 'Bloom Alert',
        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        image: 'https://images.unsplash.com/photo-1508780709619-79562169bc51?w=800',
        likes: 67
      },
      {
        id: 3,
        title: 'Organic Soil Nourishment Batch',
        description: 'Prepared a fresh batch of neem cake, organic compost, and coco-peat mix to nourish our newly grafted plants for active rooting.',
        tag: 'Organic Practice',
        date: new Date(Date.now() - 86400000 * 5).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800',
        likes: 29
      }
    ];

    const stored = localStorage.getItem('farm_journal');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hasOldPlaceholders = parsed.some((item: any) => 
          item.image && item.image.includes('1507290439931-a861b5a38200')
        );
        if (parsed.length > 0 && !hasOldPlaceholders) {
          setLatestActivities(parsed.slice(0, 3));
        } else {
          setLatestActivities(defaultJournal);
          localStorage.setItem('farm_journal', JSON.stringify(defaultJournal));
        }
      } catch (e) {
        setLatestActivities(defaultJournal);
      }
    } else {
      setLatestActivities(defaultJournal);
      localStorage.setItem('farm_journal', JSON.stringify(defaultJournal));
    }
  }, []);

  return (
    <div className="overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ── PREMIUM HERO SECTION ── */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16">
        {/* Background Image and Glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-soft-green/30 via-white/80 to-soft-pink/30 dark:from-emerald-950/20 dark:via-slate-950/90 dark:to-pink-950/10"></div>
          {/* Natural Blur blobs */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-cactus/10 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ y: [0, 50, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-[-5%] w-[35rem] h-[35rem] bg-pitaya/10 rounded-full blur-[100px]"
          />
        </div>
        
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-cactus/15 text-farm-green dark:text-emerald-400 font-bold text-xs mb-6 uppercase tracking-widest shadow-md">
              <Leaf size={14} className="text-cactus animate-pulse" />
              <span>Premium High-Yield Dragon Fruit Farm</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.05] mb-6 tracking-tighter">
              Discover Premium <br />
              <span className="text-gradient-pitaya font-black">Dragon Fruit</span> <br />
              & Plant Cuttings
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg leading-relaxed font-medium">
              Join the organic revolution with Adarsh Farm. Book farm fresh red, white, and yellow pitayas, order healthy grafted saplings, and explore professional cultivation guides.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/marketplace" className="btn-pitaya text-lg flex items-center group">
                <span>Shop Plants & Fruits</span>
                <ChevronRight className="group-hover:translate-x-1.5 transition-transform" size={20} />
              </Link>
              <Link to="/visit" className="btn-secondary text-lg flex items-center">
                <Calendar className="text-cactus" size={20} />
                <span>Book Farm Tour</span>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative lg:block"
          >
            <div className="relative z-10 p-2">
              <img 
                src="/images/hero_main.png" 
                alt="Organic Dragon Fruit Farm at Sunrise" 
                className="rounded-[4rem] shadow-2xl shadow-slate-300/40 dark:shadow-black/60 rotate-1 hover:rotate-0 transition-transform duration-1000 aspect-[4/3] md:aspect-[16/10] object-cover border-8 border-white dark:border-slate-900"
              />
            </div>
            
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-6 bg-white/95 dark:bg-slate-900/95 p-6 rounded-[2rem] shadow-xl z-20 border border-slate-100 dark:border-slate-800 backdrop-blur-md"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-farm-green p-3 rounded-xl text-white shadow-md shadow-farm-green/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">100% Organic</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Certified Plantations</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-4 -right-4 bg-white/95 dark:bg-slate-900/95 py-3 px-5 rounded-2xl shadow-xl z-20 border border-slate-100 dark:border-slate-800 backdrop-blur-md"
            >
              <div className="flex items-center space-x-2">
                <Star size={16} fill="#EAB308" className="text-yellow-500" />
                <span className="text-sm font-black text-slate-900 dark:text-white">4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-12 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem count="10k+" label="Saplings Rooted" />
            <StatItem count="1,200+" label="Visits Scheduled" />
            <StatItem count="100% Organic" label="Farm Cultivation" />
            <StatItem count="12+ Exotic" label="Pitaya Varieties" />
          </div>
        </div>
      </section>

      {/* ── CORE ECOSYSTEM SERVICES ── */}
      <section className="py-24 bg-soft-green/30 dark:bg-emerald-950/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
              Our Farming <span className="text-gradient-green">Ecosystem</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg font-medium">
              Empowering growers with authentic high-yield cuttings, expert cultivation support, and premium organic harvests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              to="/guide" 
              icon={<Leaf size={28} className="text-cactus" />} 
              title="Farming Masterclass" 
              desc="Step-by-step guidance on trellising, concrete poles, winter pruning, and soil preparation."
              color="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800"
            />
            <ServiceCard 
              to="/scanner" 
              icon={<Sprout size={28} className="text-white" />} 
              title={
                <div className="flex items-center gap-2">
                  <span>AI Crop Doctor</span>
                  <span className="bg-white/20 text-[9px] font-black px-2 py-0.5 rounded-full">FREE</span>
                </div>
              }
              desc="Snap photos of plant stems, flowers or fruit to instantly diagnose diseases or root rot problems."
              color="bg-cactus text-white shadow-lg shadow-cactus/20 hover:bg-cactus-hover"
            />
            <ServiceCard 
              to="/marketplace" 
              icon={<ShoppingCart size={28} className="text-pitaya" />} 
              title="Cuttings & Fruits Shop" 
              desc="Secure high-yield grafted saplings or pre-order fresh seasonal harvests directly from the field."
              color="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800"
            />
          </div>
        </div>
      </section>

      {/* ── LIVE FARM JOURNAL / TIMELINE SECTION ── */}
      <section className="py-24 bg-white dark:bg-slate-900/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <div className="inline-flex items-center space-x-2 bg-pitaya/10 text-pitaya px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4">
                <Activity size={14} />
                <span>Real-Time Updates</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                Live Farm <span className="text-gradient-pitaya">Journal</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-md">
                Get a glimpse of current seasonal activities, night-blooming statuses, and harvesting operations.
              </p>
            </div>
            
            <Link 
              to="/gallery" 
              className="mt-6 md:mt-0 font-bold text-pitaya flex items-center gap-2 group hover:text-pitaya-hover transition-colors"
            >
              <span>View Full Farm Timeline</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestActivities.map((activity) => (
              <div 
                key={activity.id}
                className="glass-card glass-card-hover overflow-hidden flex flex-col h-full border border-slate-100 dark:border-slate-800 bg-slate-50/50"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img 
                    src={activity.image} 
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      activity.tag === 'Harvest' ? 'bg-emerald-500 text-white' :
                      activity.tag === 'Bloom Alert' ? 'bg-pink-500 text-white' :
                      activity.tag === 'Farm Tour' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {activity.tag}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">{activity.date}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-1">{activity.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">{activity.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5 hover:text-pitaya transition-colors cursor-pointer">
                      <Heart size={14} className="text-pitaya fill-pitaya/20" /> {activity.likes} Likes
                    </span>
                    <span>Adarsh Farm Updates</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HARVEST PREDICTION CALCULATOR ── */}
      <section className="py-24 bg-soft-green/10 dark:bg-emerald-950/5 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-cactus/10 px-4 py-2 rounded-full text-cactus font-bold text-xs mb-6 uppercase tracking-widest">
                <Sprout size={14} />
                <span>Smart Agriculture Tools</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight">
                Predict Your <br />
                <span className="text-gradient-green font-black">Perfect Harvest</span> Date
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                Proper timing is critical for sweetness accumulation in pitayas. Use this scientific calculator to determine the best picking window based on your flower blooming logs.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Accurate 30-35 day temperature adjusted ripening window",
                  "Optimized Brix (sugar content) timing estimation",
                  "Ensures premium post-harvest shelf life",
                  "Directly export calculations as a reminder"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold">
                    <div className="w-6 h-6 bg-cactus/20 text-cactus rounded-full flex items-center justify-center text-xs">
                      ✓
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <HarvestCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION: VISIT THE FARM ── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-farm-green via-cactus to-farm-green rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-farm-green/20 border border-white/10">
            <div className="absolute top-[-20%] right-[-10%] w-[35rem] h-[35rem] bg-pitaya/25 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[35rem] h-[35rem] bg-emerald-400/25 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter drop-shadow-md">
                Experience Dragon Fruit Cultivation
              </h2>
              <p className="text-emerald-50/90 text-lg mb-10 leading-relaxed font-medium">
                Interested in commercial pitaya planting or tasting fresh varieties straight from the vine? Schedule a guided tour of our farm in Uttar Pradesh and meet our expert agronomists.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/visit" className="btn-pitaya text-lg px-10 hover:scale-102">
                  <span>Schedule Farm Visit</span>
                </Link>
                <Link to="/marketplace" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3.5 px-10 rounded-full font-bold text-lg transition-all backdrop-blur-md hover:-translate-y-0.5">
                  <span>Browse Cuttings Shop</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-16 text-center tracking-tight">
            Loved by Agricultural Entrepreneurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ReviewCard name="Ramesh Mishra" role="Commercial Farmer, Bihar" text="The grafted plant cuttings from Adarsh Farm are highly resilient. Rooted and sprouted within three weeks!" />
            <ReviewCard name="Sunita Devi" role="Rooftop Cultivator, Lucknow" text="I ordered 4 American Beauty cuttings. The fruits are rich, deep pink, and incredibly sweet. Best farm online." />
            <ReviewCard name="Vikram Singh" role="Agritech Consultant" text="Their AI Crop Doctor scanner diagnoses fungal stem rot accurately. Invaluable tool for farmers starting out." />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ count, label }: { count: string, label: string }) {
  return (
    <div className="text-center p-4">
      <p className="text-3xl md:text-5xl font-black text-cactus mb-1 tracking-tight">{count}</p>
      <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">{label}</p>
    </div>
  );
}

function ServiceCard({ to, icon, title, desc, color }: { to: string, icon: React.ReactNode, title: React.ReactNode, desc: string, color: string }) {
  return (
    <Link to={to} className={`group p-10 rounded-[3rem] transition-all duration-300 relative top-0 hover:-top-2 hover:shadow-xl ${color}`}>
      <div className="mb-8 group-hover:scale-105 transition-transform inline-block p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="opacity-75 leading-relaxed mb-8 text-sm">{desc}</p>
      <div className="flex items-center font-extrabold text-xs uppercase tracking-wider group-hover:translate-x-1.5 transition-transform">
        <span>Get Started</span>
        <ChevronRight size={14} className="ml-1" />
      </div>
    </Link>
  );
}

function ReviewCard({ name, role, text }: { name: string, role: string, text: string }) {
  return (
    <div className="bg-white dark:bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-left relative group hover:shadow-xl transition-all duration-300">
      <div className="flex text-yellow-500 mb-4">
        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" className="text-yellow-500" />)}
      </div>
      <p className="text-slate-600 dark:text-slate-300 italic mb-8 leading-relaxed">"{text}"</p>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-cactus/10 text-cactus rounded-xl flex items-center justify-center font-black text-lg">
          {name[0]}
        </div>
        <div>
          <p className="font-bold text-slate-850 dark:text-white text-base leading-tight">{name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{role}</p>
        </div>
      </div>
    </div>
  );
}
