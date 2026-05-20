import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Image as ImageIcon, Users, 
  Settings, Plus, Trash2, ExternalLink, 
  AlertCircle, ShieldAlert,
  Search, Mail, UserPlus, X, Tag, Edit3,
  MapPin, Phone, Calendar
} from 'lucide-react';
import { logActivity } from '../utils/logger';

const SUPER_ADMIN_EMAIL = 'surya.mishra49@gmail.com';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState<any>(null);
  const [verifiedAdmins, setVerifiedAdmins] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  
  // Orders Management
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Products Management
  const [products, setProducts] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', unit: 'kg', category: 'Fruit', description: '', 
    image: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=800',
    allowedPayments: ['cod', 'upi', 'card', 'netbanking']
  });

  // Gallery Management
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  // Journal Management
  const [journalPosts, setJournalPosts] = useState<any[]>([]);
  
  // Visit Approval States
  const [approvingVisit, setApprovingVisit] = useState<any | null>(null);
  const [selectedGuide, setSelectedGuide] = useState('Manoj Kumar');
  const [adminNotes, setAdminNotes] = useState('');
  
  // Journal Create States
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDesc, setNewPostDesc] = useState('');
  const [newPostTag, setNewPostTag] = useState<'Harvest' | 'Bloom Alert' | 'Farm Tour' | 'Organic Practice'>('Harvest');
  const [newPostImage, setNewPostImage] = useState('');

  // Farm Settings
  const [farmSettings, setFarmSettings] = useState({
    farmName: 'Adarsh Dragon Fruit Farm',
    contactEmail: 'contact@adarshfarm.com',
    phone: '+91 9876543210',
    maintenanceMode: false
  });

  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    const admins = JSON.parse(localStorage.getItem('verified_admins') || '[]');
    setVerifiedAdmins(admins);

    const storedProducts = JSON.parse(localStorage.getItem('farm_products') || '[]');
    setProducts(storedProducts);

    const storedOrders = JSON.parse(localStorage.getItem('farm_orders') || '[]');
    setOrders(storedOrders);

    const storedGallery = JSON.parse(localStorage.getItem('farm_gallery') || '[]');
    if (storedGallery.length > 0 && typeof storedGallery[0] === 'object') {
      setGalleryImages(storedGallery);
    } else {
      // Create defaults
      const defaults = [
        { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=800', title: 'Farm Sunrise' },
        { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800', title: 'Pitaya Bloom' }
      ];
      setGalleryImages(defaults);
      localStorage.setItem('farm_gallery', JSON.stringify(defaults));
    }

    const storedSettings = JSON.parse(localStorage.getItem('farm_settings') || 'null');
    if (storedSettings) setFarmSettings(storedSettings);

    const storedVisits = JSON.parse(localStorage.getItem('farm_visits') || '[]');
    setVisits(storedVisits);

    const storedJournal = JSON.parse(localStorage.getItem('farm_journal') || '[]');
    setJournalPosts(storedJournal);
  }, []);

  const handleUpdateVisitStatus = (visitId: string, status: string, guideName?: string, coordinatorNotes?: string) => {
    const updated = visits.map(v => v.id === visitId ? { ...v, status, guideName, coordinatorNotes } : v);
    setVisits(updated);
    localStorage.setItem('farm_visits', JSON.stringify(updated));
    
    const visit = updated.find(v => v.id === visitId);
    logActivity('APPOINTMENT_UPDATED', `Visit ${visitId} status changed to ${status} for ${visit?.name}`);

    // Send notification to user
    const users = JSON.parse(localStorage.getItem('users_db') || '[]'); // Mock user DB
    const targetUser = users.find((u: any) => u.loginId === visit?.loginId);
    if (targetUser) {
      const message = status === 'Approved' 
        ? `Your farm visit for ${visit?.date} has been approved. Guide: ${guideName}. Notes: ${coordinatorNotes || 'None'}.`
        : `Your farm visit for ${visit?.date} has been denied.`;

      const notification = {
        id: Date.now(),
        type: status === 'Approved' ? 'success' : 'error',
        title: `Visit ${status}`,
        message: message,
        date: new Date().toISOString(),
        read: false
      };
      targetUser.notifications = [notification, ...(targetUser.notifications || [])];
      localStorage.setItem('users_db', JSON.stringify(users));
      
      // Also update current logged in user if they are the one
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (currentUser && currentUser.loginId === targetUser.loginId) {
        currentUser.notifications = targetUser.notifications;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
    }
  };

  const handlePublishJournalPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostDesc) return;

    const newPost = {
      id: Date.now(),
      title: newPostTitle,
      description: newPostDesc,
      tag: newPostTag,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      image: newPostImage || '/images/red_fruit.png',
      likes: 0,
      comments: []
    };

    const updated = [newPost, ...journalPosts];
    setJournalPosts(updated);
    localStorage.setItem('farm_journal', JSON.stringify(updated));

    logActivity('JOURNAL_POST_CREATED', `Admin published new update: ${newPostTitle}`);
    
    setNewPostTitle('');
    setNewPostDesc('');
    setNewPostImage('');
  };

  const handleRemoveJournalPost = (id: number) => {
    if (user?.email !== SUPER_ADMIN_EMAIL) {
      alert('Only Super Admin can delete updates.');
      return;
    }
    const updated = journalPosts.filter(post => post.id !== id);
    setJournalPosts(updated);
    localStorage.setItem('farm_journal', JSON.stringify(updated));
    logActivity('JOURNAL_POST_DELETED', `Admin deleted update ID: ${id}`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: string, trackingId?: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status, trackingId: trackingId !== undefined ? trackingId : o.trackingId };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('farm_orders', JSON.stringify(updated));
    
    const order = updated.find(o => o.id === orderId);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status, trackingId: trackingId !== undefined ? trackingId : selectedOrder.trackingId });
    }

    // Send notification to user
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const targetUser = users.find((u: any) => u.loginId === order?.userLoginId);
    if (targetUser) {
      const notification = {
        id: Date.now(),
        type: 'info',
        title: `Order Updated`,
        message: `Your order #${orderId} status is now ${status}. ${trackingId ? 'Tracking ID provided: ' + trackingId : ''}`,
        date: new Date().toISOString(),
        read: false
      };
      targetUser.notifications = [notification, ...(targetUser.notifications || [])];
      localStorage.setItem('users_db', JSON.stringify(users));
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const p = { ...newProduct, id: Date.now(), price: Number(newProduct.price) };
    const updated = [...products, p];
    setProducts(updated);
    localStorage.setItem('farm_products', JSON.stringify(updated));
    setShowAddProduct(false);
    setNewProduct({ 
      name: '', price: '', unit: 'kg', category: 'Fruit', description: '', 
      image: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=800',
      allowedPayments: ['cod', 'upi', 'card', 'netbanking']
    });
  };

  const handleDeleteProduct = (id: number) => {
    if (user?.email !== SUPER_ADMIN_EMAIL) {
      alert('Only Super Admin can delete products.');
      return;
    }
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('farm_products', JSON.stringify(updated));
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    if (verifiedAdmins.includes(newAdminEmail) || newAdminEmail === SUPER_ADMIN_EMAIL) {
      alert('This user is already an admin.');
      return;
    }
    const updated = [...verifiedAdmins, newAdminEmail];
    setVerifiedAdmins(updated);
    localStorage.setItem('verified_admins', JSON.stringify(updated));
    setNewAdminEmail('');
  };

  const handleRemoveAdmin = (email: string) => {
    if (user?.email !== SUPER_ADMIN_EMAIL) {
      alert('Only the Super Admin can remove other admins.');
      return;
    }
    const updated = verifiedAdmins.filter(a => a !== email);
    setVerifiedAdmins(updated);
    localStorage.setItem('verified_admins', JSON.stringify(updated));
  };

  const handleFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = (e.target as any).elements[0];
    const file = fileInput.files[0];
    if (!file) return;

    try {
      const base64 = await handleFileUpload(file);
      const newImg = { id: Date.now(), url: base64, title: file.name, type: 'image' };
      const updated = [newImg, ...galleryImages];
      setGalleryImages(updated);
      localStorage.setItem('farm_gallery', JSON.stringify(updated));
      fileInput.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (user?.email !== SUPER_ADMIN_EMAIL) {
      alert('Only Super Admin can delete images.');
      return;
    }
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
    localStorage.setItem('farm_gallery', JSON.stringify(updated));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.email !== SUPER_ADMIN_EMAIL) {
      alert('Only Super Admin can change settings.');
      return;
    }
    localStorage.setItem('farm_settings', JSON.stringify(farmSettings));
    alert('Settings saved successfully!');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-red-100 max-w-md">
          <ShieldAlert size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Access Denied</h2>
          <p className="text-gray-500 font-medium mb-8">You do not have administrative privileges to view this page.</p>
          <button onClick={() => window.location.href = '/login'} className="w-full btn-primary py-4">Return to Login</button>
        </div>
      </div>
    );
  }

  const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;

  return (
    <div className="bg-[#fafafa] min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <aside className="lg:w-80 space-y-2">
            <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cactus flex items-center justify-center text-white font-black text-lg">
                  {user.name[0]}
                </div>
                <div>
                  <h2 className="font-black text-gray-900 leading-none">{user.name}</h2>
                  <p className="text-[10px] font-black text-cactus uppercase tracking-widest mt-1">
                    {isSuperAdmin ? 'Super Admin' : 'Farm Admin'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
            </div>

            <nav className="space-y-1">
              <AdminTabBtn id="orders" icon={<ShoppingBag size={20}/>} label="Orders" active={activeTab} set={setActiveTab} count={orders.filter(o => o.status === 'Pending').length} />
              <AdminTabBtn id="products" icon={<Tag size={20}/>} label="Products" active={activeTab} set={setActiveTab} />
              <AdminTabBtn id="gallery" icon={<ImageIcon size={20}/>} label="Gallery" active={activeTab} set={setActiveTab} />
              <AdminTabBtn id="visits" icon={<Calendar size={20}/>} label="Visits" active={activeTab} set={setActiveTab} count={visits.filter(v => v.status === 'Pending').length} />
              <AdminTabBtn id="team" icon={<Users size={20}/>} label="Team Management" active={activeTab} set={setActiveTab} />
              <AdminTabBtn id="settings" icon={<Settings size={20}/>} label="Farm Settings" active={activeTab} set={setActiveTab} />
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button onClick={() => window.location.href = '/history'} className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-white hover:text-gray-900 transition-all">
                  <div className="flex items-center space-x-3"><AlertCircle size={20}/> <span className="text-sm">Activity Logs</span></div>
                  <ExternalLink size={16} className="text-gray-300" />
                </button>
              </div>
            </nav>
          </aside>

          <main className="flex-grow">
            
            {activeTab === 'orders' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">Farm Orders</h1>
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 bg-gray-50/50">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order ID</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6 text-sm font-black text-gray-900">{order.id}</td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-bold text-gray-800">{order.userName}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.userEmail}</p>
                          </td>
                          <td className="px-8 py-6 text-sm font-black text-cactus">₹{order.total}</td>
                          <td className="px-8 py-6">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-8 py-6">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="text-cactus font-black text-[10px] uppercase tracking-widest hover:underline flex items-center"
                            >
                              View Details <ChevronRight size={12} className="ml-1" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedOrder && (
                  <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h2 className="text-2xl font-black text-gray-900">Order {selectedOrder.id}</h2>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-900"><X size={24}/></button>
                      </div>

                      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Details</h4>
                            <div className="flex items-center space-x-3">
                              <Users size={16} className="text-cactus" />
                              <span className="font-bold text-gray-900">{selectedOrder.userName}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Phone size={16} className="text-cactus" />
                              <span className="font-bold text-gray-900">{selectedOrder.address.phone}</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping Address</h4>
                            <div className="flex items-start space-x-3">
                              <MapPin size={16} className="text-cactus mt-1" />
                              <span className="text-sm font-medium text-gray-600">
                                {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.pincode}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ordered Items</h4>
                          <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                            {selectedOrder.items.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-800">{item.quantity}x {item.name}</span>
                                <span className="font-black text-gray-900">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                              <span className="font-black text-gray-900">Total Paid</span>
                              <span className="text-xl font-black text-cactus">₹{selectedOrder.total}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-gray-100">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Manage Status & Tracking</h4>
                          <div className="flex flex-wrap gap-3">
                            <StatusBtn active={selectedOrder.status === 'Pending'} label="Pending" onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Pending')} />
                            <StatusBtn active={selectedOrder.status === 'Processing'} label="Processing" onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Processing')} />
                            <StatusBtn active={selectedOrder.status === 'Shipped'} label="Shipped" onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Shipped')} />
                            <StatusBtn active={selectedOrder.status === 'Delivered'} label="Delivered" onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Delivered')} />
                          </div>

                          {selectedOrder.status === 'Shipped' && (
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tracking ID</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Enter Tracking Number..."
                                  defaultValue={selectedOrder.trackingId}
                                  onBlur={(e) => handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status, e.target.value)}
                                  className="flex-grow px-5 py-3 bg-gray-50 rounded-xl outline-none text-sm font-bold"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Catalog</h1>
                  {isSuperAdmin && (
                    <button 
                      onClick={() => setShowAddProduct(true)}
                      className="btn-primary py-3 px-6 flex items-center space-x-2"
                    >
                      <Plus size={20} />
                      <span>Add Product</span>
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 bg-gray-50/50">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Product</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Price</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                              <img src={p.image} className="w-12 h-12 rounded-xl object-cover" />
                              <span className="font-bold text-gray-900">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-gray-500">{p.category}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-black text-pitaya">₹{p.price}</span>
                          </td>
                          <td className="px-8 py-6">
                            {isSuperAdmin && (
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18}/>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {showAddProduct && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-gray-900">Add New Product</h2>
                        <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-900"><X size={24}/></button>
                      </div>
                      <form onSubmit={handleAddProduct} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Name</label>
                            <input 
                              type="text" 
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                              className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-cactus/20"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Price (₹)</label>
                            <input 
                              type="number" 
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                              className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-cactus/20"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Unit</label>
                            <select 
                              value={newProduct.unit}
                              onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                              className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-cactus/20"
                            >
                              <option>kg</option>
                              <option>pot</option>
                              <option>piece</option>
                            </select>
                           </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Product Image</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const base64 = await handleFileUpload(file);
                                setNewProduct({...newProduct, image: base64});
                              }
                            }}
                            className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-cactus/20"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                          <textarea 
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-cactus/20 min-h-[100px]"
                            required
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Available Payment Methods</label>
                          <div className="flex flex-wrap gap-4">
                            <PaymentCheckbox 
                              label="COD" 
                              checked={newProduct.allowedPayments.includes('cod')} 
                              onChange={(checked) => {
                                const payments = checked 
                                  ? [...newProduct.allowedPayments, 'cod']
                                  : newProduct.allowedPayments.filter(p => p !== 'cod');
                                setNewProduct({...newProduct, allowedPayments: payments});
                              }}
                            />
                            <PaymentCheckbox 
                              label="UPI" 
                              checked={newProduct.allowedPayments.includes('upi')} 
                              onChange={(checked) => {
                                const payments = checked 
                                  ? [...newProduct.allowedPayments, 'upi']
                                  : newProduct.allowedPayments.filter(p => p !== 'upi');
                                setNewProduct({...newProduct, allowedPayments: payments});
                              }}
                            />
                            <PaymentCheckbox 
                              label="Card" 
                              checked={newProduct.allowedPayments.includes('card')} 
                              onChange={(checked) => {
                                const payments = checked 
                                  ? [...newProduct.allowedPayments, 'card']
                                  : newProduct.allowedPayments.filter(p => p !== 'card');
                                setNewProduct({...newProduct, allowedPayments: payments});
                              }}
                            />
                            <PaymentCheckbox 
                              label="Net Banking" 
                              checked={newProduct.allowedPayments.includes('netbanking')} 
                              onChange={(checked) => {
                                const payments = checked 
                                  ? [...newProduct.allowedPayments, 'netbanking']
                                  : newProduct.allowedPayments.filter(p => p !== 'netbanking');
                                setNewProduct({...newProduct, allowedPayments: payments});
                              }}
                            />
                          </div>
                        </div>
                        <button type="submit" className="w-full btn-primary py-4 text-lg">Create Product</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Live Farm Journal</h1>
                    <p className="text-gray-500 text-sm mt-1">Publish updates, seasonal alerts, and harvest logs.</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Publish New Update Log</h3>
                  <form onSubmit={handlePublishJournalPost} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-450 ml-1">Title</label>
                        <input 
                          type="text"
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          placeholder="e.g. Night Bloom Spectacle"
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-455 ml-1">Category</label>
                        <select 
                          value={newPostTag}
                          onChange={(e) => setNewPostTag(e.target.value as any)}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs cursor-pointer"
                        >
                          <option value="Harvest">Harvest</option>
                          <option value="Bloom Alert">Bloom Alert</option>
                          <option value="Farm Tour">Farm Tour</option>
                          <option value="Organic Practice">Organic Practice</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-450 ml-1">Image Link / Path</label>
                        <input 
                          type="text"
                          value={newPostImage}
                          onChange={(e) => setNewPostImage(e.target.value)}
                          placeholder="e.g. /images/red_fruit.png or Unsplash URL"
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-450 ml-1">Description</label>
                      <textarea 
                        value={newPostDesc}
                        onChange={(e) => setNewPostDesc(e.target.value)}
                        placeholder="Detail what is happening at the farm (e.g. fertilizer mix ratio, crop yield)..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs resize-none"
                        required
                      />
                    </div>

                    <button type="submit" className="btn-primary py-3.5 px-10 text-xs uppercase tracking-widest">
                      Publish Farm Update
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Active Logs ({journalPosts.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {journalPosts.map((post) => (
                      <div key={post.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex gap-4 items-center">
                        <img src={post.image} className="w-20 h-20 rounded-2xl object-cover shrink-0" alt="" />
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-cactus">{post.tag}</span>
                            <span className="text-[9px] font-bold text-gray-400">{post.date}</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-900 mt-1 truncate">{post.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-normal font-semibold">{post.description}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveJournalPost(post.id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEAM MANAGEMENT TAB */}
            {activeTab === 'team' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Team Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage secondary administrators for Adarsh Farm.</p>
                  </div>
                </div>

                {isSuperAdmin ? (
                  <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <UserPlus size={24} className="text-cactus" />
                      <span>Verify New Admin</span>
                    </h3>
                    <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-grow relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                          type="email" 
                          placeholder="Enter email address..."
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl outline-none border-none focus:ring-4 focus:ring-cactus/10 transition-all font-medium"
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary py-4 px-10">Add Admin</button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 flex items-start gap-4">
                    <AlertCircle className="text-yellow-600 mt-1" size={20} />
                    <div>
                      <p className="font-bold text-yellow-800">Limited Access</p>
                      <p className="text-sm text-yellow-700">Only the Super Admin ({SUPER_ADMIN_EMAIL}) can add or remove team members.</p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="font-bold text-gray-900">Verified Administrators</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <div className="px-8 py-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-black text-xs">SA</div>
                        <div>
                          <p className="font-bold text-gray-900">{SUPER_ADMIN_EMAIL}</p>
                          <span className="text-[10px] font-black text-cactus uppercase tracking-widest">Primary Super Admin</span>
                        </div>
                      </div>
                    </div>
                    {verifiedAdmins.map((admin) => (
                      <div key={admin} className="px-8 py-6 flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-cactus/10 flex items-center justify-center text-cactus font-black text-xs">FA</div>
                          <div>
                            <p className="font-bold text-gray-900">{admin}</p>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Farm Manager</span>
                          </div>
                        </div>
                        {isSuperAdmin && (
                          <button onClick={() => handleRemoveAdmin(admin)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FARM SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Farm Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Configure global platform preferences.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 md:p-10">
                  <form onSubmit={handleSaveSettings} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Platform Name</label>
                        <input 
                          type="text" 
                          value={farmSettings.farmName}
                          onChange={(e) => setFarmSettings({...farmSettings, farmName: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-cactus/20"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Contact Email</label>
                        <input 
                          type="email" 
                          value={farmSettings.contactEmail}
                          onChange={(e) => setFarmSettings({...farmSettings, contactEmail: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-cactus/20"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Support Phone Number</label>
                        <input 
                          type="text" 
                          value={farmSettings.phone}
                          onChange={(e) => setFarmSettings({...farmSettings, phone: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-cactus/20"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Maintenance Mode</label>
                        <div className="flex items-center space-x-4 pt-2">
                          <button 
                            type="button"
                            onClick={() => setFarmSettings({...farmSettings, maintenanceMode: !farmSettings.maintenanceMode})}
                            className={`w-14 h-8 rounded-full p-1 transition-colors ${farmSettings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
                          >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${farmSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                          <span className="text-sm font-bold text-gray-500">
                            {farmSettings.maintenanceMode ? 'Active (Site is down)' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50 flex justify-end">
                      <button type="submit" className="btn-primary py-4 px-12">Save Configuration</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
             {/* VISITS TAB */}
            {activeTab === 'visits' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Farm Visit Requests</h1>
                    <p className="text-gray-500 text-sm mt-1">Review guest bookings, assign guides, and write coordinator notes.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                      <thead>
                        <tr className="border-b border-gray-50 bg-gray-50/50">
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Visitor & Tour</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date & Time</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Guests & Fee</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Guide & Notes</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-xs font-bold">
                        {visits.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">No visit requests yet.</td>
                          </tr>
                        ) : (
                          visits.map((visit) => (
                            <tr key={visit.id}>
                              <td className="px-8 py-6">
                                <p className="text-sm font-black text-gray-900">{visit.name}</p>
                                <p className="text-[10px] text-gray-405 uppercase tracking-widest mt-0.5">{visit.tourType || 'General Farm Tour'}</p>
                              </td>
                              <td className="px-8 py-6 text-gray-650">
                                {visit.date} <br />
                                <span className="text-[10px] text-gray-400 font-black">{visit.time}</span>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-gray-900">{visit.guests} Guests</p>
                                <p className="text-cactus font-black">₹{visit.totalPrice || visit.guests * 100}</p>
                              </td>
                              <td className="px-8 py-6 text-gray-500 max-w-[200px] truncate">
                                {visit.status === 'Approved' ? (
                                  <>
                                    <p className="text-gray-900">Guide: {visit.guideName || 'Not Assigned'}</p>
                                    <p className="text-[10px] italic">{visit.coordinatorNotes || 'No notes'}</p>
                                  </>
                                ) : (
                                  <span className="italic text-gray-400">{visit.status === 'Denied' ? 'Denied' : visit.status === 'Cancelled' ? 'Cancelled' : 'Awaiting approval'}</span>
                                )}
                              </td>
                              <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  visit.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                  visit.status === 'Denied' ? 'bg-red-50 text-red-600' :
                                  visit.status === 'Cancelled' ? 'bg-slate-100 text-slate-500' :
                                  'bg-yellow-50 text-yellow-600'
                                }`}>
                                  {visit.status}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex space-x-2">
                                  {visit.status === 'Pending' && (
                                    <>
                                      <button 
                                        onClick={() => setApprovingVisit(visit)}
                                        className="px-4 py-2 bg-cactus text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:shadow-md transition-shadow"
                                      >
                                        Approve
                                      </button>
                                      <button 
                                        onClick={() => handleUpdateVisitStatus(visit.id, 'Denied')}
                                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:shadow-md transition-shadow"
                                      >
                                        Deny
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* APPROVAL SETTINGS MODAL */}
                {approvingVisit && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
                      <button 
                        onClick={() => setApprovingVisit(null)}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                      <h3 className="text-xl font-black text-gray-900 mb-6">Assign Tour Guides</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-widest text-gray-450 ml-1 mb-1.5">Assign Tour Guide</label>
                          <select 
                            value={selectedGuide}
                            onChange={(e) => setSelectedGuide(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs cursor-pointer border border-gray-150"
                          >
                            <option value="Manoj Kumar">Manoj Kumar (Senior Agronomist)</option>
                            <option value="Adarsh Mishra">Adarsh Mishra (Farm Owner)</option>
                            <option value="Ravi Shankar">Ravi Shankar (Grafting Specialist)</option>
                            <option value="Self Guided">Self Guided Tour</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-widest text-gray-455 ml-1 mb-1.5">Coordinator Notes for Visitors</label>
                          <textarea 
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add tips (e.g. wear hats, prepare tasting platters, etc.)..."
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs resize-none border border-gray-150"
                          />
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex gap-2">
                          <button 
                            onClick={() => {
                              handleUpdateVisitStatus(approvingVisit.id, 'Approved', selectedGuide, adminNotes);
                              setApprovingVisit(null);
                              setSelectedGuide('Manoj Kumar');
                              setAdminNotes('');
                            }}
                            className="flex-grow btn-primary py-3 text-xs uppercase tracking-widest cursor-pointer"
                          >
                            Confirm & Approve
                          </button>
                          <button 
                            onClick={() => setApprovingVisit(null)}
                            className="px-6 py-3 bg-gray-100 text-gray-500 rounded-full font-bold text-xs uppercase tracking-widest cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function AdminTabBtn({ id, icon, label, active, set, count }: any) {
  const isSelected = active === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
        isSelected 
        ? 'bg-cactus text-white shadow-lg shadow-cactus/20' 
        : 'text-gray-500 hover:bg-white hover:text-gray-900'
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
          isSelected ? 'bg-white text-cactus' : 'bg-cactus/10 text-cactus'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function PaymentCheckbox({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer group">
      <div 
        onClick={() => onChange(!checked)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          checked ? 'bg-cactus border-cactus text-white' : 'border-gray-200 bg-white group-hover:border-cactus'
        }`}
      >
        {checked && <Plus size={14} className="rotate-45" />}
      </div>
      <span className={`text-xs font-bold ${checked ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'Pending': 'text-yellow-500 bg-yellow-50',
    'Processing': 'text-blue-500 bg-blue-50',
    'Shipped': 'text-purple-500 bg-purple-50',
    'Delivered': 'text-green-500 bg-green-50'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
}

function StatusBtn({ active, label, onClick }: any) {
  const styles: any = {
    'Pending': 'border-yellow-200 text-yellow-600 bg-yellow-50',
    'Processing': 'border-blue-200 text-blue-600 bg-blue-50',
    'Shipped': 'border-purple-200 text-purple-600 bg-purple-50',
    'Delivered': 'border-green-200 text-green-600 bg-green-50'
  };
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
        active ? styles[label] : 'border-gray-50 text-gray-400 hover:border-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

function ChevronRight({ size, className }: any) {
  return <ExternalLink size={size} className={className} />;
}
