import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Star, ShoppingCart, 
  Search, Calendar, ArrowUpRight,
  ShieldCheck, Zap, Heart, Leaf
} from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-pink-white -z-10"></div>
        
        {/* Animated Shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-[10%] left-[5%] w-64 h-64 bg-cactus/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold text-sm mb-6">
              <Zap size={16} className="text-yellow-300" />
              <span>Premium Organic Farm • Maharashtra</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 drop-shadow-xl">
              Dragon Fruit <br />
              <span className="text-gray-800">Farming </span> 
              Reimagined
            </h1>
            <p className="text-lg text-white/90 mb-10 max-w-lg leading-relaxed">
              Experience high-yield cultivation, smart AI disease detection, and a direct-to-farm marketplace. Growing the future, one pitaya at a time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/marketplace" className="btn-primary py-4 px-8 text-lg shadow-xl shadow-cactus/30 flex items-center group">
                <span>Shop Fresh</span>
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/visit" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 py-4 px-8 rounded-full font-bold text-lg transition-all flex items-center">
                <Calendar className="mr-2" size={20} />
                <span>Book a Visit</span>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 p-8">
               <img 
                src="https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=800" 
                alt="Dragon Fruit" 
                className="rounded-[4rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl z-20 animate-bounce-slow">
              <div className="flex items-center space-x-4">
                <div className="bg-cactus p-3 rounded-2xl text-white">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-black text-gray-800">100% Organic</p>
                  <p className="text-xs text-gray-500">Certified Quality</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem count="10k+" label="Happy Farmers" />
            <StatItem count="500+" label="Live Plants Sold" />
            <StatItem count="12+" label="Exotic Varieties" />
            <StatItem count="4.9/5" label="Average Rating" />
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Our Core Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to succeed in dragon fruit cultivation, from seed to harvest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              to="/guide" 
              icon={<Leaf size={32} />} 
              title="Farming Guide" 
              desc="Step-by-step modules for soil prep, trellising, and organic pruning."
              color="bg-pink-100 text-pitaya"
            />
            <ServiceCard 
              to="/scanner" 
              icon={<Search size={32} />} 
              title="AI Doctor" 
              desc="Snap a photo and use AI to instantly identify diseases and deficiencies."
              color="bg-green-100 text-cactus"
            />
            <ServiceCard 
              to="/marketplace" 
              icon={<ShoppingCart size={32} />} 
              title="Marketplace" 
              desc="Buy premium cuttings or sell your harvest directly to buyers."
              color="bg-blue-100 text-blue-600"
            />
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cactus/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pitaya/20 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to Grow Your Farm?</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Join our community of successful dragon fruit farmers today and get access to exclusive tips and AI tools.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="btn-primary py-4 px-10 text-lg">Join for Free</Link>
                <Link to="/visit" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 px-10 rounded-full font-bold text-lg transition-all">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-16">Farmer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ReviewCard name="Ramesh Kumar" role="Commercial Farmer" text="The AI scanner saved my crop last season. Highly recommended for every farm!" />
            <ReviewCard name="Sunita Devi" role="Home Gardener" text="Best place for high-yield cuttings. The plants are healthy and growing fast." />
            <ReviewCard name="Arvind Singh" role="Aspiring Agri-preneur" text="Excellent guide for beginners. The step-by-step approach made it easy to start." />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ count, label }: { count: string, label: string }) {
  return (
    <div className="text-center p-6">
      <p className="text-4xl md:text-5xl font-black text-pitaya mb-2">{count}</p>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{label}</p>
    </div>
  );
}

function ServiceCard({ to, icon, title, desc, color }: { to: string, icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <Link to={to} className="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-gray-50 relative top-0 hover:-top-2">
      <div className={`inline-flex p-5 rounded-3xl mb-8 group-hover:scale-110 transition-transform ${color}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed mb-8">{desc}</p>
      <div className="flex items-center text-cactus font-black text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
        <span>Explore</span>
        <ChevronRight size={16} className="ml-1" />
      </div>
    </Link>
  );
}

function ReviewCard({ name, role, text }: { name: string, role: string, text: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-left relative">
      <div className="flex text-yellow-400 mb-4">
        {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
      </div>
      <p className="text-gray-600 italic mb-8 leading-relaxed">"{text}"</p>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-400">
          {name[0]}
        </div>
        <div>
          <p className="font-bold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <Heart className="absolute top-8 right-8 text-pink-100" size={32} />
    </div>
  );
}
