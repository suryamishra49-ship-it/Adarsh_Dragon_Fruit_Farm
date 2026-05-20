import { useState, useEffect } from 'react';
import { Plus, X, Heart, MessageSquare, Tag, Calendar, Send } from 'lucide-react';
import VarietyGallery from '../components/VarietyGallery';

interface Comment {
  id: number;
  userName: string;
  text: string;
  date: string;
}

interface JournalEntry {
  id: number;
  title: string;
  description: string;
  tag: 'Harvest' | 'Bloom Alert' | 'Farm Tour' | 'Organic Practice';
  date: string;
  image: string;
  likes: number;
  comments?: Comment[];
}

export default function Gallery() {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'OWNER' || user?.role === 'ADMIN';

  const [activeTab, setActiveTab] = useState<'varieties' | 'journal'>('varieties');
  const [journalItems, setJournalItems] = useState<JournalEntry[]>([]);
  const [filterTag, setFilterTag] = useState<string>('All');
  
  // Interaction state
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Admin Create Post State
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTag, setNewTag] = useState<'Harvest' | 'Bloom Alert' | 'Farm Tour' | 'Organic Practice'>('Harvest');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    const defaultJournal: JournalEntry[] = [
      {
        id: 1,
        title: 'Bumper Summer Harvest',
        description: 'Successfully harvested 140kg of premium American Beauty & Palora Yellow dragon fruits today! Sweetness levels hit record highs.',
        tag: 'Harvest',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        image: '/images/red_fruit.png',
        likes: 42,
        comments: [
          { id: 101, userName: 'Ramesh Mishra', text: 'Can we order some today? Looking so sweet!', date: 'Just now' }
        ]
      },
      {
        id: 2,
        title: 'Midnight Bloom Spectacle',
        description: 'American Beauty flowers opened fully tonight! Over 300 massive white blossoms illuminated the twilight. A spectacular sight.',
        tag: 'Bloom Alert',
        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        image: 'https://images.unsplash.com/photo-1508780709619-79562169bc51?w=800',
        likes: 67,
        comments: [
          { id: 102, userName: 'Sunita Devi', text: 'Breathtaking flowers! Truly nature at its best.', date: '1 day ago' }
        ]
      },
      {
        id: 3,
        title: 'Organic Soil Nourishment Batch',
        description: 'Prepared a fresh batch of neem cake, organic compost, and coco-peat mix to nourish our newly grafted plants for active rooting.',
        tag: 'Organic Practice',
        date: new Date(Date.now() - 86400000 * 5).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800',
        likes: 29,
        comments: []
      }
    ];

    const stored = localStorage.getItem('farm_journal');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setJournalItems(parsed);
        } else {
          setJournalItems(defaultJournal);
          localStorage.setItem('farm_journal', JSON.stringify(defaultJournal));
        }
      } catch (e) {
        setJournalItems(defaultJournal);
      }
    } else {
      setJournalItems(defaultJournal);
      localStorage.setItem('farm_journal', JSON.stringify(defaultJournal));
    }
  }, []);

  const handleLike = (id: number) => {
    const updated = journalItems.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    setJournalItems(updated);
    localStorage.setItem('farm_journal', JSON.stringify(updated));
    
    // Update active modal view details
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleAddComment = (e: React.FormEvent, entryId: number) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const commentatorName = loggedUser.name || 'Visitor';

    const newComment: Comment = {
      id: Date.now(),
      userName: commentatorName,
      text: commentText,
      date: 'Just now'
    };

    const updated = journalItems.map(item => {
      if (item.id === entryId) {
        const list = item.comments || [];
        return { ...item, comments: [...list, newComment] };
      }
      return item;
    });

    setJournalItems(updated);
    localStorage.setItem('farm_journal', JSON.stringify(updated));

    // Update active modal details
    const target = updated.find(item => item.id === entryId);
    if (target) {
      setSelectedEntry(target);
    }
    setCommentText('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) {
      alert('Please fill out Title and Description.');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      tag: newTag,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      image: newImage || 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=800',
      likes: 0,
      comments: []
    };

    const updated = [newEntry, ...journalItems];
    setJournalItems(updated);
    localStorage.setItem('farm_journal', JSON.stringify(updated));
    
    setShowCreate(false);
    setNewTitle('');
    setNewDesc('');
    setNewImage('');
  };

  const tags = ['All', 'Harvest', 'Bloom Alert', 'Farm Tour', 'Organic Practice'];

  const filteredJournal = journalItems.filter(item => 
    filterTag === 'All' || item.tag === filterTag
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 font-sans">
      {/* ── HEADER ── */}
      <div className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pitaya/10 via-slate-50 to-slate-50 dark:from-emerald-950/15 dark:via-slate-950 dark:to-slate-950 -z-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-6xl mx-auto">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter leading-none">
                Farm <span className="text-gradient-pitaya font-black">Showcase</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-base max-w-lg">
                Discover the botanical varieties of our pitaya crop and read updates from our live farm work timeline.
              </p>
            </div>
            
            <div className="flex bg-slate-200/50 dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shrink-0">
              <button 
                onClick={() => setActiveTab('varieties')}
                className={`px-8 py-3.5 rounded-[1.5rem] font-bold text-xs tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === 'varieties' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                    : 'text-slate-450 hover:text-slate-600'
                }`}
              >
                Exotic Varieties
              </button>
              <button 
                onClick={() => setActiveTab('journal')}
                className={`px-8 py-3.5 rounded-[1.5rem] font-bold text-xs tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === 'journal' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' 
                    : 'text-slate-450 hover:text-slate-600'
                }`}
              >
                Live Journal
              </button>
            </div>

            {activeTab === 'journal' && isAdmin && (
              <button 
                onClick={() => setShowCreate(true)}
                className="btn-primary py-3 px-6 text-xs uppercase tracking-widest"
              >
                <Plus size={16} />
                <span>Create Journal Post</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        {activeTab === 'varieties' ? (
          <VarietyGallery />
        ) : (
          <div>
            {/* Journal Category Tag Filters */}
            <div className="flex flex-wrap gap-2.5 mb-10 justify-center">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    filterTag === tag 
                      ? 'bg-cactus text-white shadow-md shadow-cactus/15'
                      : 'bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-slate-400 dark:text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Timeline Feed */}
            {filteredJournal.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-850">
                <p className="text-sm font-bold text-slate-450 italic">No posts found for this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredJournal.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="glass-card glass-card-hover overflow-hidden flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img 
                        src={entry.image} 
                        alt={entry.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm ${
                          entry.tag === 'Harvest' ? 'bg-emerald-500' :
                          entry.tag === 'Bloom Alert' ? 'bg-pink-500' :
                          entry.tag === 'Farm Tour' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}>
                          {entry.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-2">
                        <Calendar size={12} />
                        <span>{entry.date}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2.5 leading-snug">{entry.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3 font-semibold">
                        {entry.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleLike(entry.id)}
                            className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-pitaya transition-colors cursor-pointer"
                          >
                            <Heart size={14} className="text-pitaya fill-pitaya/10" />
                            <span>{entry.likes} Likes</span>
                          </button>

                          <button 
                            onClick={() => setSelectedEntry(entry)}
                            className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-cactus transition-colors cursor-pointer"
                          >
                            <MessageSquare size={14} className="text-cactus" />
                            <span>{(entry.comments || []).length} Comments</span>
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedEntry(entry)}
                          className="text-[10px] font-black text-cactus hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL (With comment section) */}
      {selectedEntry && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setSelectedEntry(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-slate-50 dark:bg-slate-850 text-slate-500 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto custom-scrollbar flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="bg-slate-100 dark:bg-slate-950 aspect-video md:aspect-auto w-full md:h-full">
                  <img src={selectedEntry.image} className="w-full h-full object-cover" alt={selectedEntry.title} />
                </div>

                <div className="p-8 md:p-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white ${
                        selectedEntry.tag === 'Harvest' ? 'bg-emerald-500' :
                        selectedEntry.tag === 'Bloom Alert' ? 'bg-pink-500' :
                        selectedEntry.tag === 'Farm Tour' ? 'bg-blue-500' : 'bg-amber-500'
                      }`}>
                        {selectedEntry.tag}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{selectedEntry.date}</span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-950 dark:text-white mb-4 leading-snug">{selectedEntry.title}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed mb-6 border-b border-slate-50 dark:border-slate-850 pb-6">{selectedEntry.description}</p>

                    {/* Likes & Title */}
                    <div className="flex items-center gap-2 mb-6">
                      <button 
                        onClick={() => handleLike(selectedEntry.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs font-black text-slate-600 dark:text-slate-350 cursor-pointer"
                      >
                        <Heart size={14} className="text-pitaya fill-pitaya" />
                        <span>{selectedEntry.likes} Likes</span>
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4 mb-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Visitor Comments</h4>
                      <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                        {(selectedEntry.comments || []).length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No comments yet. Be the first to write!</p>
                        ) : (
                          (selectedEntry.comments || []).map(comment => (
                            <div key={comment.id} className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-black text-slate-900 dark:text-white">{comment.userName}</span>
                                <span className="text-[9px] font-bold text-slate-400">{comment.date}</span>
                              </div>
                              <p className="text-xs text-slate-550 dark:text-slate-400 leading-normal">{comment.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comment Input */}
                  <form onSubmit={(e) => handleAddComment(e, selectedEntry.id)} className="border-t border-slate-100 dark:border-slate-850 pt-4 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Write a public comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-grow px-4 py-3 text-xs bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-cactus/20"
                    />
                    <button type="submit" className="p-3.5 bg-cactus hover:bg-cactus-hover text-white rounded-xl cursor-pointer">
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Create Post Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setShowCreate(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-6">New Journal Post</h3>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1">Post Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Night Blooming Spectacle"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-bold text-xs dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1">Update Category</label>
                <select 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-bold text-xs dark:text-white cursor-pointer"
                >
                  <option value="Harvest">Harvest Operations</option>
                  <option value="Bloom Alert">Bloom Alert warnings</option>
                  <option value="Farm Tour">Farm Tour update</option>
                  <option value="Organic Practice">Organic Practice info</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Image link or /images/... path"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-bold text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 ml-1 mb-1">Detailed Log Description</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Write details about what is happening on the farm..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-bold text-xs dark:text-white resize-none"
                  required
                />
              </div>

              <button type="submit" className="w-full btn-primary py-3 text-xs uppercase tracking-widest mt-4">
                Publish Update Log
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
