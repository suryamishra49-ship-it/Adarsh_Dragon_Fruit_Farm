import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Star, ShoppingCart, 
  Search, Calendar,
  ShieldCheck, Heart, Leaf
} from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden bg-white">
      {/* ── GREEN & WHITE HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-[-10]">
          <img 
            src="/src/assets/bg-dragon-fruit.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-soft-green/50 via-white to-white"></div>
        </div>
        
        {/* Animated Natural Shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-15%] right-[-5%] w-[50rem] h-[50rem] bg-cactus/5 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5%] left-[5%] w-[35rem] h-[35rem] bg-farm-green/5 rounded-full blur-[120px]"
        />

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-cactus/10 text-farm-green font-bold text-xs mb-8 uppercase tracking-widest shadow-sm">
              <Leaf size={14} className="text-cactus" />
              <span>Premium High-Yield Dragon Fruit Farm</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tighter">
              Premium <span className="text-cactus">Quality</span> <br />
              <span className="text-farm-green">Farming</span> Solutions
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-lg leading-relaxed font-medium">
              Join the agricultural revolution with Adarsh Farm. We provide high-yield dragon fruit cuttings, expert guides, and fresh harvests directly to you.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/marketplace" className="btn-primary py-5 px-10 text-xl flex items-center group">
                <span>Shop Fresh</span>
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/visit" className="bg-white hover:bg-soft-green text-farm-green border border-cactus/20 py-5 px-10 rounded-full font-bold text-xl transition-all flex items-center shadow-sm">
                <Calendar className="mr-2 text-cactus" size={20} />
                <span>Book Farm Visit</span>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 p-4">
               <img 
                src="/src/assets/bg-dragon-fruit.png" 
                alt="Organic Dragon Fruit Farm" 
                className="rounded-[5rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-1000 aspect-[4/5] object-cover border-8 border-white"
              />
            </div>
            {/* Floating Info Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl z-20 border border-soft-green"
            >
              <div className="flex items-center space-x-5">
                <div className="bg-farm-green p-4 rounded-2xl text-white shadow-lg shadow-farm-green/20">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-lg leading-tight">Premium Quality</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Farm to Table</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 border-y border-gray-50 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem count="10k+" label="Happy Farmers" />
            <StatItem count="500+" label="Live Plants Sold" />
            <StatItem count="12+" label="Exotic Varieties" />
            <StatItem count="4.9/5" label="Average Rating" />
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES (Green Theme) ── */}
      <section className="py-32 bg-soft-green/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Our Farming Ecosystem</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Empowering dragon fruit cultivators with modern tech and organic wisdom.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ServiceCard 
              to="/guide" 
              icon={<Leaf size={32} />} 
              title="Farming Guide" 
              desc="Step-by-step modules for soil prep, trellising, and organic pruning."
              color="bg-white text-cactus border border-cactus/10"
            />
            <ServiceCard 
              to="/scanner" 
              icon={<Search size={32} />} 
              title="AI Doctor" 
              desc="Snap a photo and use AI to instantly identify diseases and deficiencies."
              color="bg-cactus text-white shadow-lg shadow-cactus/20"
            />
            <ServiceCard 
              to="/marketplace" 
              icon={<ShoppingCart size={32} />} 
              title="Marketplace" 
              desc="Buy premium cuttings or sell your harvest directly to buyers."
              color="bg-white text-farm-green border border-farm-green/10"
            />
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-farm-green rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">Start Your Farming Journey</h2>
              <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Join our community of thousands of successful dragon fruit farmers. Get access to AI tools, expert guides, and a direct marketplace.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/register" className="bg-white text-farm-green py-5 px-12 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-xl">Join Now</Link>
                <Link to="/visit" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-5 px-12 rounded-full font-bold text-xl transition-all">Book Visit</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-20 text-center tracking-tight">Trusted by Farmers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
      <p className="text-4xl md:text-6xl font-black text-farm-green mb-2">{count}</p>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{label}</p>
    </div>
  );
}

function ServiceCard({ to, icon, title, desc, color }: { to: string, icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <Link to={to} className={`group p-12 rounded-[3rem] transition-all relative top-0 hover:-top-3 hover:shadow-2xl ${color}`}>
      <div className="mb-10 group-hover:scale-110 transition-transform inline-block">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="opacity-70 leading-relaxed mb-10 text-sm">{desc}</p>
      <div className="flex items-center font-black text-xs uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
        <span>Learn More</span>
        <ChevronRight size={16} className="ml-1" />
      </div>
    </Link>
  );
}

function ReviewCard({ name, role, text }: { name: string, role: string, text: string }) {
  return (
    <div className="bg-soft-green/20 p-10 rounded-[3rem] border border-cactus/5 text-left relative group hover:bg-white hover:shadow-xl transition-all">
      <div className="flex text-yellow-400 mb-6">
        {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
      </div>
      <p className="text-gray-700 italic mb-10 leading-relaxed text-lg">"{text}"</p>
      <div className="flex items-center space-x-5">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-cactus shadow-sm">
          {name[0]}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{name}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{role}</p>
        </div>
      </div>
      <Heart className="absolute top-10 right-10 text-cactus/5 group-hover:text-pitaya/10 transition-colors" size={40} />
    </div>
  );
}
