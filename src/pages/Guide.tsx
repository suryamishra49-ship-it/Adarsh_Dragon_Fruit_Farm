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
    { id: 1, title: 'Seed Selection', description: 'Choose high-quality, disease-resistant dragon fruit seeds or cuttings.' },
    { id: 2, title: 'Soil Preparation', description: 'Pitaya thrives in well-draining sandy loam soil with pH 6-7.' },
    { id: 3, title: 'Planting', description: 'Plant cuttings in 1-foot deep holes with natural fertilizer.' },
    { id: 4, title: 'Support System', description: 'Install concrete pillars or wooden stakes for the cacti to climb.' },
    { id: 5, title: 'Irrigation & Care', description: 'Water twice a week. Ensure 6-8 hours of direct sunlight.' },
    { id: 6, title: 'Harvesting', description: 'Pick the fruit when it turns bright pink and the skin is slightly soft.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="gradient-pink-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 drop-shadow-md">Seed-to-Harvest Guide</h1>
              <p className="text-white/90 text-lg">Your AI-powered companion for dragon fruit farming.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/30 flex items-center space-x-6 text-white">
              <div className="text-center">
                <Sun size={32} className="mx-auto mb-1" />
                <p className="text-2xl font-bold">32°C</p>
                <p className="text-xs opacity-80">Maharashtra</p>
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
                HEATWAVE ALERT
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
                <LineChart size={18} /> <span>Tracker</span>
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
                    <div key={step.id} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 transition-all ${completedSteps.includes(step.id) ? 'border-cactus bg-green-50/30' : 'border-pitaya'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${completedSteps.includes(step.id) ? 'bg-cactus/20 text-cactus' : 'bg-pitaya/20 text-pitaya'}`}>
                              Stage {step.id}
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

            <div className="bg-pitaya/10 p-6 rounded-3xl border border-pitaya/20">
              <h4 className="font-bold text-pitaya mb-2 text-sm">Did you know?</h4>
              <p className="text-xs text-pitaya/80 leading-relaxed">
                Dragon fruits are actually nocturnal bloomers. Their stunning white flowers open at night and usually last for only one evening!
              </p>
            </div>
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
    { date: '2026-05-10', height: 12, unit: 'cm' },
    { date: '2026-05-01', height: 8, unit: 'cm' },
  ]);
  const [height, setHeight] = useState('');

  const addLog = () => {
    if (!height) return;
    setLogs([{ date: new Date().toISOString().split('T')[0], height: Number(height), unit: 'cm' }, ...logs]);
    setHeight('');
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
        <Ruler className="text-cactus" /> <span>Plant Growth Log</span>
      </h3>
      
      <div className="flex space-x-4 mb-8">
        <input 
          type="number" 
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Enter height in cm"
          className="flex-grow px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-cactus"
        />
        <button onClick={addLog} className="bg-cactus text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2">
          <Plus size={20} /> <span>Log</span>
        </button>
      </div>

      <div className="space-y-4">
        {logs.map((log, i) => (
          <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0">
            <span className="text-gray-500 font-medium">{log.date}</span>
            <span className="text-lg font-black text-gray-800">{log.height} {log.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Farm Doctor. How can I help you today?' },
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
        text: "Based on the growth stage you've logged, make sure to prune the side branches to encourage vertical growth. This will increase yield significantly." 
      }]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
      <div className="p-4 border-b border-gray-50 bg-gray-50/50 rounded-t-3xl flex items-center space-x-3">
        <div className="w-10 h-10 bg-pitaya rounded-full flex items-center justify-center text-white font-bold">AI</div>
        <div>
          <p className="font-bold text-gray-800 leading-tight">Farm Doctor</p>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-cactus text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-50 flex space-x-3">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about fertilizer, pests, or harvesting..."
          className="flex-grow px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-pitaya/20"
        />
        <button type="submit" className="bg-pitaya text-white p-3 rounded-xl shadow-lg shadow-pitaya/20">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
