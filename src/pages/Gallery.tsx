import { useState, useEffect } from 'react';
import { Plus, Play, X, Image as ImageIcon, Cherry } from 'lucide-react';
import VarietyGallery from '../components/VarietyGallery';

interface Media {
  id: number;
  type: 'image' | 'video';
  url: string;
  title: string;
}

export default function Gallery() {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();
  
  const isAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const initialMedia: Media[] = [
    { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=800', title: 'Farm Sunrise' },
    { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800', title: 'Pitaya Bloom' },
    { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1620127252536-03bdfcf6d5c3?w=800', title: 'Harvest Day' },
    { id: 4, type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-ripe-dragon-fruit-on-the-plant-34444-large.mp4', title: 'Growth Timelapse' },
    { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1550258114-189a79444811?w=800', title: 'Organic Soil' },
    { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1621506289937-9ccc14d599d0?w=800', title: 'Young Plants' },
  ];

  const [mediaItems, setMediaItems] = useState<Media[]>(initialMedia);
  const [showUpload, setShowUpload] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'life' | 'varieties'>('varieties');
  useEffect(() => {
    const storedGallery = JSON.parse(localStorage.getItem('farm_gallery') || 'null');
    if (storedGallery && Array.isArray(storedGallery) && storedGallery.length > 0 && typeof storedGallery[0] === 'object') {
      setMediaItems(storedGallery);
    } else {
      localStorage.setItem('farm_gallery', JSON.stringify(initialMedia));
    }
  }, []);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Media = {
      id: Date.now(),
      type: newUrl.includes('mp4') ? 'video' : 'image',
      url: newUrl || 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=800',
      title: newTitle || 'New Activity'
    };
    const updated = [newItem, ...mediaItems];
    setMediaItems(updated);
    localStorage.setItem('farm_gallery', JSON.stringify(updated));
    setShowUpload(false);
    setNewTitle('');
    setNewUrl('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-6 tracking-tighter leading-none">
            Farm <span className="text-gradient-pitaya">Showcase</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-lg">Explore our diverse dragon fruit varieties and peek into the daily life at Adarsh Farm.</p>
        </div>
        
        <div className="flex bg-gray-100 p-2 rounded-[2rem] w-fit">
          <button 
            onClick={() => setActiveTab('varieties')}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-bold transition-all ${
              activeTab === 'varieties' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Cherry size={20} />
            <span>Varieties</span>
          </button>
          <button 
            onClick={() => setActiveTab('life')}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-bold transition-all ${
              activeTab === 'life' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ImageIcon size={20} />
            <span>Farm Life</span>
          </button>
        </div>

        {activeTab === 'life' && isAdmin && (
          <button 
            onClick={() => setShowUpload(true)}
            className="flex items-center space-x-2 bg-cactus text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-cactus/20 hover:scale-105 transition-transform"
          >
            <Plus size={20} />
            <span>Upload Media</span>
          </button>
        )}
      </div>

      {activeTab === 'varieties' ? (
        <VarietyGallery />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-[3rem] bg-gray-100 aspect-video shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="relative w-full h-full">
                  <video src={item.url} className="w-full h-full object-cover" muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                    <div className="bg-white/30 backdrop-blur-md p-6 rounded-full">
                      <Play className="text-white fill-white" size={32} />
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white text-xl font-black">{item.title}</p>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">{item.type === 'image' ? 'Photograph' : 'Video'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
            <button onClick={() => setShowUpload(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Upload New Media</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Watering the saplings"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-pitaya"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Media URL</label>
                <input 
                  type="url" 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Image or video URL"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-pitaya"
                  required
                />
              </div>
              <button type="submit" className="w-full btn-primary py-3">
                Append to Gallery
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
