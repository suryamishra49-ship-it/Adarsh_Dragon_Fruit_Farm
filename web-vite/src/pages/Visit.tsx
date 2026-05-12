import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Visit() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const times = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            We've received your request for a farm visit on <span className="font-semibold">{selectedDate}</span> at <span className="font-semibold">{selectedTime}</span>.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            Book Another Visit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Visit Our <span className="text-pitaya">Organic Farm</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the beauty of dragon fruit farming first-hand. Join us for a guided tour and fresh tasting sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
              <div className="bg-pink-100 p-3 rounded-xl">
                <MapPin className="text-pitaya" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Location</h3>
                <p className="text-gray-600">Adarsh Dragon Fruit Farm, Near Green Valley, Maharashtra</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Users className="text-cactus" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">What to Expect</h3>
                <ul className="text-gray-600 list-disc list-inside space-y-1 mt-2">
                  <li>Guided tour of 1000+ pitaya plants</li>
                  <li>Live harvesting demonstration</li>
                  <li>Fresh fruit tasting session</li>
                  <li>Photography opportunities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Book Your Slot</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pitaya/20 focus:border-pitaya outline-none transition-all"
                  />
                  <Calendar className="absolute right-4 top-3 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {times.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedTime === time
                          ? 'bg-cactus text-white border-cactus shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-cactus'
                      }`}
                    >
                      <Clock size={14} className="inline mr-1" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pitaya/20 focus:border-pitaya outline-none"
                />
              </div>

              <button 
                type="submit"
                disabled={!selectedDate || !selectedTime}
                className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
