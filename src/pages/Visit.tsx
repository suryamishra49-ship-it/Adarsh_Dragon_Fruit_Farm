import { Calendar, Clock, MapPin, Users, CheckCircle, Info, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { logActivity } from '../utils/logger';

export default function Visit() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [tourType, setTourType] = useState('General Farm Tour & Fruit Tasting');
  const [submitted, setSubmitted] = useState(false);
  const [visitorName, setVisitorName] = useState('');

  const times = [
    { label: '09:30 AM', capacity: 'Morning Fresh', slotsLeft: 8 },
    { label: '11:00 AM', capacity: 'Tasting Special', slotsLeft: 3 },
    { label: '02:30 PM', capacity: 'Warm Sun Tour', slotsLeft: 5 },
    { label: '04:30 PM', capacity: 'Evening Calm', slotsLeft: 12 },
    { label: '07:30 PM', capacity: 'Night-Bloom View (Seasonal)', slotsLeft: 4 }
  ];

  const tourPrices: { [key: string]: number } = {
    'General Farm Tour & Fruit Tasting': 0,
    'Commercial Cultivation Seminar': 0,
    'Night-Bloom Viewing & Photo Session': 0
  };

  const getPricePerGuest = () => tourPrices[tourType] || 0;
  const totalPrice = 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !visitorName) {
      alert('Please fill out all booking details.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    const visitData = {
      id: 'VIS-' + Date.now(),
      date: selectedDate,
      time: selectedTime,
      name: visitorName,
      tourType,
      guests: guestCount,
      totalPrice,
      loginId: user?.loginId || 'Guest',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const existingVisits = JSON.parse(localStorage.getItem('farm_visits') || '[]');
    localStorage.setItem('farm_visits', JSON.stringify([visitData, ...existingVisits]));

    // Update notifications for user
    if (user && user.loginId) {
      const users = JSON.parse(localStorage.getItem('users_db') || '[]');
      const idx = users.findIndex((u: any) => u.loginId === user.loginId);
      if (idx > -1) {
        const notify = {
          id: Date.now(),
          type: 'info',
          title: 'Farm Visit Requested',
          message: `Your visit booking on ${selectedDate} at ${selectedTime} is awaiting owner review.`,
          date: new Date().toISOString(),
          read: false
        };
        users[idx].notifications = [notify, ...(users[idx].notifications || [])];
        localStorage.setItem('users_db', JSON.stringify(users));
        
        // Sync local storage active session
        user.notifications = users[idx].notifications;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }

    logActivity('APPOINTMENT_CREATED', `New visit request from ${visitorName} for ${selectedDate} at ${selectedTime}`);

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-[85vh] flex items-center justify-center p-6 pt-24">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200">
          <div className="bg-cactus w-20 h-20 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-cactus/10">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Booking Requested!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            We have submitted your request for <span className="font-extrabold text-slate-850 dark:text-slate-200">{tourType}</span> on <span className="font-extrabold text-slate-850 dark:text-slate-200">{selectedDate}</span> at <span className="font-extrabold text-slate-850 dark:text-slate-200">{selectedTime}</span>.
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-950/70 p-5 rounded-2xl mb-8 border border-slate-100 dark:border-slate-850 text-left space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-450">
              <span>Visitor Name:</span>
              <span className="text-slate-700 dark:text-slate-350">{visitorName}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-450">
              <span>Group Size:</span>
              <span className="text-slate-700 dark:text-slate-350">{guestCount} Guests</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-450">
              <span>Entry Fee:</span>
              <span className="text-cactus">Free of Cost</span>
            </div>
          </div>

          <button 
            onClick={() => {
              setSubmitted(false);
              setSelectedDate('');
              setSelectedTime('');
              setVisitorName('');
              setGuestCount(2);
            }}
            className="w-full btn-primary py-3.5 text-sm"
          >
            Book Another Tour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 font-sans">
      {/* ── HEADER ── */}
      <div className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cactus/10 via-slate-50 to-slate-50 dark:from-emerald-950/15 dark:via-slate-950 dark:to-slate-950 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-pitaya/5 rounded-full blur-[120px] -z-20"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white mb-6 tracking-tighter leading-none">
            Schedule a <span className="text-gradient-green font-black">Farm Visit</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg">
            Experience organic pitaya farming up close. Meet our agronomists, learn trellising, and taste fresh, ripe dragon fruit varieties right under the sun.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-slate-850 shadow-sm aspect-[16/10]">
              <img 
                src="/images/hero_main.png" 
                alt="Adarsh Dragon Fruit Farm" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="glass-card p-8 border border-slate-100 dark:border-slate-850">
              <div className="bg-cactus/10 p-3 rounded-2xl inline-block mb-6 text-cactus">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Farm Location</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                Adarsh Dragon Fruit Farm,<br />
                Matiyara Mahamdapur Gadwara,<br />
                Pratapgarh, Uttar Pradesh, 230131
              </p>
            </div>

            <div className="glass-card p-8 border border-slate-100 dark:border-slate-850">
              <div className="bg-pitaya/10 p-3 rounded-2xl inline-block mb-6 text-pitaya">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Guided Activities</h3>
              <ul className="space-y-3.5 text-slate-500 dark:text-slate-400 text-xs font-bold">
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-cactus rounded-full shrink-0"></div>
                  <span>Tour of 1,000+ trellis-supported pitaya plants</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-cactus rounded-full shrink-0"></div>
                  <span>Pruning & Grafting agricultural workshops</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-cactus rounded-full shrink-0"></div>
                  <span>Sampling sessions of 6+ exotic varieties</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-cactus rounded-full shrink-0"></div>
                  <span>Stunning sunset photography opportunities</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-6 rounded-3xl flex gap-3 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <Info className="shrink-0 text-amber-500" size={18} />
              <div>
                <p className="font-bold mb-0.5">Seasonal Note</p>
                <span>For experiencing the nocturnal giant flower blooming spectacle, choose the "Night-Bloom Viewing" tour slot (7:30 PM) between June and October.</span>
              </div>
            </div>
          </div>

          {/* Scheduler Form Side */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-850">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Schedule Your Visit</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tour Type */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 ml-1 mb-2">Select Tour Experience</label>
                <select 
                  value={tourType}
                  onChange={(e) => setTourType(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cactus/20 font-bold text-xs dark:text-white cursor-pointer"
                >
                  <option value="General Farm Tour & Fruit Tasting">General Farm Tour & Fruit Tasting (Free)</option>
                  <option value="Commercial Cultivation Seminar">Commercial Cultivation Seminar (Free)</option>
                  <option value="Night-Bloom Viewing & Photo Session">Night-Bloom Viewing & Photo Session (Free)</option>
                </select>
              </div>

              {/* Guest Count */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 ml-1">Number of Guests</label>
                  <span className="text-xs font-black text-cactus">{guestCount} Visitors</span>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="flex-grow accent-cactus cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="w-10 text-right font-black text-sm text-slate-900 dark:text-white shrink-0">
                    {guestCount}
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 ml-1 mb-2">Choose Visit Date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cactus/20 font-bold text-xs dark:text-white"
                  />
                  <Calendar className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 ml-1 mb-2">Select Availability Slot</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {times.map((slot) => {
                    const isSelected = selectedTime === slot.label;
                    return (
                      <button
                        key={slot.label}
                        type="button"
                        onClick={() => setSelectedTime(slot.label)}
                        className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex justify-between items-start ${
                          isSelected
                            ? 'bg-cactus/5 border-cactus'
                            : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-slate-200'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Clock size={12} className={isSelected ? 'text-cactus' : 'text-slate-400'} />
                            {slot.label}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 mt-0.5">{slot.capacity}</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          slot.slotsLeft <= 3 
                            ? 'bg-rose-50 text-rose-500 border border-rose-100' 
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                        }`}>
                          {slot.slotsLeft} left
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visitor Name */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 ml-1 mb-2">Primary Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-55 dark:bg-slate-950/70 border border-slate-150 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-cactus/20 font-bold text-xs dark:text-white"
                />
              </div>

              {/* Price Calculation and Summary */}
              {selectedTime && selectedDate && (
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Total Entry Fee</span>
                    <span className="text-2xl font-black text-cactus">Free of Cost</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-1">for {guestCount} guests</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-cactus">
                    <Sparkles size={14} />
                    <span>No Payment Required</span>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={!selectedDate || !selectedTime || !visitorName}
                className="w-full btn-primary py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Submit Visit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
