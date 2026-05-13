import { useState } from 'react';
import { 
  CloudRain, Sun, Droplets, 
  MessageSquare, ChevronRight, CheckCircle2, 
  LineChart, Bell, History as HistoryIcon,
  Wind, Ruler, Plus, Send
} from 'lucide-react';

export default function Guide() {
  const [activeTab, setActiveTab] = useState<'guide' | 'tracker' | 'ai'>('guide');
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);
  
  const steps = [
    { id: 1, title: 'Cutting Selection', description: 'Choose healthy, 1-2 year old cuttings from high-yielding mother plants. Ensure they are disease-free.', highlight: true },
    { id: 2, title: 'Soil Preparation', description: 'Pitaya thrives in well-draining sandy loam soil with pH 6-7. Mix with organic manure.' },
    { id: 3, title: 'Planting Cuttings', description: 'Plant cuttings 2-3 inches deep. Keep the flat side facing the support pillar.' },
    { id: 4, title: 'Support System', description: 'Install concrete pillars with a top frame for the branches to hang and fruiting.' },
    { id: 5, title: 'Irrigation & Care', description: 'Water twice a week. Prune side branches to maintain a single main stem.' },
    { id: 6, title: 'Harvesting', description: 'Pick the fruit 30-35 days after flowering when it turns bright pink.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="gradient-pink-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 drop-shadow-md">Cutting-to-Harvest Guide</h1>
              <p className="text-white/90 text-lg">Your expert companion for dragon fruit plantation.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/30 flex items-center space-x-6 text-white">
              <div className="text-center">
                <Sun size={32} className="mx-auto mb-1" />
                <p className="text-2xl font-bold">32°C</p>
                <p className="text-xs opacity-80">Pratapgarh</p>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm">
                  <Wind size={14} /> <span>12 km/h</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Droplets size={14} /> <span>45% Humid</span>
                </div>
              </div>
              <div className="bg-orange-500/80 px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
                OPTIMAL PLANTING
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow">
            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-2xl shadow-sm mb-8 max-w-md border border-gray-100">
              <button 
                onClick={() => setActiveTab('guide')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'guide' ? 'bg-cactus text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <ChevronRight size={18} /> <span>Guide</span>
              </button>
              <button 
                onClick={() => setActiveTab('tracker')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'tracker' ? 'bg-cactus text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <LineChart size={18} /> <span>Log Book</span>
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'ai' ? 'bg-cactus text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <MessageSquare size={18} /> <span>AI Help</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'guide' && (
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.id} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 transition-all ${step.highlight ? 'border-pitaya bg-pitaya/5' : completedSteps.includes(step.id) ? 'border-cactus bg-green-50/30' : 'border-gray-200'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${step.highlight ? 'bg-pitaya text-white' : completedSteps.includes(step.id) ? 'bg-cactus/20 text-cactus' : 'bg-gray-100 text-gray-500'}`}>
                              Stage {step.id} {step.highlight && '· Recommended'}
                            </span>
                            {completedSteps.includes(step.id) && <CheckCircle2 className="text-cactus" size={16} />}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                        <button 
                          onClick={() => setCompletedSteps(prev => prev.includes(step.id) ? prev.filter(i => i !== step.id) : [...prev, step.id])}
                          className={`mt-1 p-2 rounded-lg transition-colors ${completedSteps.includes(step.id) ? 'text-cactus bg-cactus/10' : 'text-gray-300 hover:text-pitaya'}`}
                        >
                          <CheckCircle2 size={24} fill={completedSteps.includes(step.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'tracker' && <GrowthTracker />}
              {activeTab === 'ai' && <AIChat />}
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Smart Reminders</h3>
                <Bell className="text-pitaya" size={20} />
              </div>
              <div className="space-y-4">
                <ReminderItem icon={<Droplets size={16}/>} title="Watering" time="Today, 5:00 PM" color="blue" />
                <ReminderItem icon={<HistoryIcon size={16}/>} title="Fertilizing" time="In 2 days" color="purple" />
                <ReminderItem icon={<CloudRain size={16}/>} title="Check Drainage" time="Rain expected" color="orange" />
              </div>
            </div>

            <div className="bg-cactus/10 p-6 rounded-3xl border border-cactus/20">
              <h4 className="font-bold text-cactus mb-2 text-sm">Cutting Tip</h4>
              <p className="text-xs text-cactus/80 leading-relaxed">
                Always use cuttings from healthy, fruit-bearing plants. Cutting plantation ensures 100% genetic similarity and faster fruiting (within 1-2 years) compared to seeds (3-5 years).
              </p>
            </div>
            
            <a href="/scanner" className="block bg-pitaya p-6 rounded-3xl text-white shadow-xl shadow-pitaya/20 hover:scale-105 transition-transform">
              <h4 className="font-black text-lg mb-2">Disease Scanner</h4>
              <p className="text-xs opacity-90 mb-4">Use our Free AI tool to detect plant diseases instantly.</p>
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-full w-fit">
                Start Scan <ChevronRight size={12} className="ml-1" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReminderItem({ icon, title, time, color }: { icon: React.ReactNode, title: string, time: string, color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };
  return (
    <div className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
      <div className={`p-2 rounded-xl ${colors[color] || 'bg-gray-100'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        <p className="text-[10px] text-gray-400">{time}</p>
      </div>
    </div>
  );
}

function GrowthTracker() {
  const [logs, setLogs] = useState([
    { date: '2026-05-10', height: 12, photo: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=100' },
    { date: '2026-05-01', height: 8, photo: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=100' },
  ]);
  const [height, setHeight] = useState('');

  const addLog = () => {
    if (!height) return;
    setLogs([{ 
      date: new Date().toISOString().split('T')[0], 
      height: Number(height), 
      photo: 'https://images.unsplash.com/photo-1520301255226-bc5f9ad6176a?w=100' 
    }, ...logs]);
    setHeight('');
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
      <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-2">
        <Ruler className="text-cactus" /> <span>Real-time Growth Log</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Height (cm)</label>
          <input 
            type="number" 
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 15"
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-cactus/10 font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Action</label>
          <button onClick={addLog} className="w-full bg-cactus text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-cactus/20 hover:scale-[1.02] transition-transform">
            Record Progress
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {logs.map((log, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="flex items-center space-x-4">
              <img src={log.photo} className="w-16 h-16 rounded-2xl object-cover" alt="Growth" />
              <div>
                <p className="text-lg font-black text-gray-900">{log.height} cm</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{log.date}</p>
              </div>
            </div>
            <div className="bg-cactus/10 text-cactus px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              +{i === logs.length - 1 ? 0 : log.height - logs[i+1]?.height} cm growth
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Farm Doctor. Ask me anything about dragon fruit plantation, diseases, or soil care!' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    const userMsg = { role: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Based on common issues in Pratapgarh, ensure your cuttings are treated with fungicide before planting. Also, dragon fruits need 6-8 hours of direct sunlight for optimal growth." 
      }]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-[550px] overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-pitaya rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pitaya/20">AI</div>
          <div>
            <p className="font-black text-gray-900 leading-tight">Farm Doctor</p>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Always Online
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-cactus text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-6 border-t border-gray-50 bg-white">
        <div className="flex space-x-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about fertilizer, pests, or harvesting..."
            className="flex-grow px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-pitaya/10 font-medium"
          />
          <button type="submit" className="bg-pitaya text-white p-4 rounded-2xl shadow-xl shadow-pitaya/20 hover:scale-105 transition-transform">
            <Send size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}
