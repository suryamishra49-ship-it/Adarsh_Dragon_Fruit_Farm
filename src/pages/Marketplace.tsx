import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Star, Search, X, 
  Heart, Share2, ChevronRight, Plus, Minus,
  CreditCard, MapPin, CheckCircle2, Package,
  Percent, Truck, AlertCircle, Info, QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { logActivity } from '../utils/logger';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  category: 'Fruit' | 'Live Plant';
  allowedPayments?: string[];
  schedule: string; // pre-order shipping date or immediate delivery
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment' | 'upi-scan' | 'success'>('cart');
  const [address, setAddress] = useState({ name: '', phone: '', city: '', pincode: '', street: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  
  // Pincode validation & delivery calculator
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [isUpiSimulating, setIsUpiSimulating] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('farm_products') || '[]');
    const hasOldPlaceholders = stored.some((p: any) => 
      p.image && (
        p.image.includes('550258114-189a79444811') || 
        p.image.includes('1620127252536-03bdfcf6d5c3') ||
        p.image.includes('1509587584298-0f3b3a3a1797') ||
        p.image.includes('1534531173927-aeb928d54385') ||
        p.image.includes('1520302817595-88509dec7ec7') ||
        p.image.includes('1463936575829-25148e1db1b8')
      )
    );
    if (stored.length > 0 && !hasOldPlaceholders) {
      setProducts(stored);
    } else {
      const initial: Product[] = [
        { 
          id: 1, 
          name: 'Premium Red Dragon Fruit (Magenta Flesh)', 
          price: 180, 
          unit: 'kg', 
          image: '/images/red_fruit.png', 
          description: 'Sweet, freshly-harvested organic red pitaya. High in antioxidants and rich in flavor.', 
          category: 'Fruit', 
          allowedPayments: ['cod', 'upi'],
          schedule: 'Pre-order: Next harvest shipping July 5th',
          stock: 250
        },
        { 
          id: 2, 
          name: 'Palora Yellow Dragon Fruit (Sweetest)', 
          price: 350, 
          unit: 'kg', 
          image: 'https://images.unsplash.com/photo-1616235293297-c812140c839f?w=800', 
          description: 'The sweetest dragon fruit variety in the world, sourced from premium Ecuadorian stock. Extremely rich and floral.', 
          category: 'Fruit', 
          allowedPayments: ['cod', 'upi'],
          schedule: 'Pre-order: Next harvest shipping July 12th',
          stock: 80
        },
        { 
          id: 3, 
          name: 'Premium White Dragon Fruit (Refreshing)', 
          price: 140, 
          unit: 'kg', 
          image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800', 
          description: 'Crisp and refreshing white flesh dragon fruit. Low sugar content, ideal for refreshing summer salads.', 
          category: 'Fruit', 
          allowedPayments: ['cod', 'upi'],
          schedule: 'Pre-order: Next harvest shipping July 5th',
          stock: 300
        },
        { 
          id: 4, 
          name: 'American Beauty Grafted Sapling', 
          price: 280, 
          unit: 'pot', 
          image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800', 
          description: 'Rooted and grafted American Beauty variety plant. Known for vigorous growing habit and heavy yields of magenta fruit.', 
          category: 'Live Plant', 
          allowedPayments: ['cod', 'upi'],
          schedule: 'Immediate Delivery (Ready for planting)',
          stock: 120
        },
        { 
          id: 5, 
          name: 'Ecuadorian Palora Yellow Rooted Cutting', 
          price: 450, 
          unit: 'pot', 
          image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800', 
          description: 'Healthy rooted cutting of the sweet yellow dragon fruit variety. Requires trellising support.', 
          category: 'Live Plant', 
          allowedPayments: ['upi'],
          schedule: 'Immediate Delivery (Shipped in organic soil mix)',
          stock: 45
        },
        { 
          id: 6, 
          name: 'Vietnamese White Plant cutting', 
          price: 99, 
          unit: 'piece', 
          image: 'https://images.unsplash.com/photo-1621506289937-9ccc14d599d0?w=800', 
          description: 'Standard commercial white variety cuttings. Clean-cut and hardened off, ready for rooting in sandy loam soil.', 
          category: 'Live Plant', 
          allowedPayments: ['cod', 'upi'],
          schedule: 'Immediate Delivery (hardened cuttings)',
          stock: 500
        },
        { 
          id: 7, 
          name: 'Organic Pitaya Soil Mix (Neem + Cow Manure)', 
          price: 199, 
          unit: 'bag', 
          image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', 
          description: 'Special formulation of organic leaf mold, well-composted cow dung, bone meal, and neem cake for robust pitaya growth.', 
          category: 'Live Plant', 
          allowedPayments: ['cod', 'upi'],
          schedule: 'Immediate Delivery (5kg bag)',
          stock: 150
        }
      ];
      setProducts(initial);
      localStorage.setItem('farm_products', JSON.stringify(initial));
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Tier-based discount calculation (15% off plants if user buys 10+ total plants)
  const totalPlantsQuantity = cart
    .filter(item => item.category === 'Live Plant')
    .reduce((sum, item) => sum + item.quantity, 0);

  const plantDiscountEligibility = totalPlantsQuantity >= 10;
  
  const plantSubtotal = cart
    .filter(item => item.category === 'Live Plant')
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
  const plantDiscountAmount = plantDiscountEligibility ? Math.round(plantSubtotal * 0.15) : 0;
  
  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartTotal = rawSubtotal - plantDiscountAmount;

  // Handle final order placing
  const handlePlaceOrder = (simulatedPaymentMethod: 'cod' | 'upi') => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) {
      alert('Please login to place an order.');
      return;
    }

    const order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      userLoginId: user.loginId,
      userEmail: user.email,
      userName: address.name || user.name,
      items: cart,
      total: cartTotal,
      address,
      paymentMethod: simulatedPaymentMethod === 'upi' ? 'UPI Pre-paid' : 'COD (Cash on Delivery)',
      status: 'Pending',
      trackingId: '',
      date: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem('farm_orders') || '[]');
    localStorage.setItem('farm_orders', JSON.stringify([order, ...existingOrders]));

    // Log the action using the imported helper
    logActivity('ORDER_PLACED', `Placed order ${order.id} totaling ₹${cartTotal}`, user);

    // Send order confirmation notification
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const idx = users.findIndex((u: any) => u.loginId === user.loginId);
    if (idx > -1) {
      const notify = {
        id: Date.now(),
        type: 'success',
        title: 'Order Booked!',
        message: `Order #${order.id} for ₹${cartTotal} is confirmed. Tracking updates will be posted here.`,
        date: new Date().toISOString(),
        read: false
      };
      users[idx].notifications = [notify, ...(users[idx].notifications || [])];
      localStorage.setItem('users_db', JSON.stringify(users));
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.notifications = users[idx].notifications;
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
    
    setCheckoutStep('success');
    setCart([]);
  };

  const startUpiFlow = () => {
    setCheckoutStep('upi-scan');
  };

  const simulateUpiPayment = () => {
    setIsUpiSimulating(true);
    setTimeout(() => {
      setIsUpiSimulating(false);
      handlePlaceOrder('upi');
    }, 2500);
  };

  const checkDeliveryPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincodeQuery)) {
      setDeliveryStatus('Please enter a valid 6-digit numeric pincode.');
      return;
    }
    
    // Simple mock routing rules based on first digit of Indian pincode
    const stateDigit = pincodeQuery.charAt(0);
    if (stateDigit === '2') {
      setDeliveryStatus('✓ Express Farm Direct: Delivery within 2-3 Days. Shipping is FREE.');
    } else if (['1', '3', '4'].includes(stateDigit)) {
      setDeliveryStatus('✓ Standard Courier Available: Delivery in 4-5 Days. Shipping is FREE.');
    } else {
      setDeliveryStatus('✓ Out-of-state Shipping: Delivery in 6-8 Days. Special protection packaging added.');
    }
  };

  const filtered = products.filter(p => 
    (category === 'All' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 font-sans">
      {/* ── PREMIUM HEADER ── */}
      <div className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pitaya/10 via-slate-50 to-slate-50 dark:from-emerald-950/10 dark:via-slate-950 dark:to-slate-950 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-cactus/5 rounded-full blur-[120px] -z-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white mb-6 tracking-tighter leading-none">
              Adarsh <span className="text-gradient-pitaya font-black">Marketplace</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto text-base mb-8">
              Secure premium, robust plant cuttings ready for potting, or book fresh seasonal dragon fruit harvest deliveries direct from our farm.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cactus transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Search red pitaya, grafted saplings, organic soil..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-24 py-5 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-slate-100 dark:border-slate-800 outline-none focus:ring-4 focus:ring-cactus/15 focus:border-cactus transition-all text-base font-semibold dark:text-white"
              />
              <button 
                onClick={() => setIsCartOpen(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-cactus hover:bg-cactus-hover py-3 px-5 rounded-full text-white shadow-md transition-transform flex items-center space-x-2 cursor-pointer"
              >
                <ShoppingCart size={18} />
                <span className="font-extrabold text-sm">{cart.length > 0 ? cart.reduce((s,i) => s+i.quantity,0) : 0}</span>
              </button>
            </div>

            {/* Bulk Discount Notice Banner */}
            <div className="mt-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 max-w-2xl mx-auto flex items-center gap-3 justify-center text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Percent size={18} className="text-cactus shrink-0" />
              <span>Plant Bulk Promotion: Add any 10 or more plants to your cart and get 15% discount on them!</span>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['All', 'Fruit', 'Live Plant'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all cursor-pointer ${
                    category === cat 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md scale-102' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800'
                  }`}
                >
                  {cat}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <div 
              key={product.id}
              className="group bg-white dark:bg-slate-900 rounded-[2.2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col h-full"
            >
              {/* Image */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-950" 
                onClick={() => setSelectedProduct(product)}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    product.category === 'Fruit' ? 'bg-pink-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {product.category}
                  </span>
                </div>
                {product.category === 'Fruit' && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-bold">
                      Seasonal booking
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.schedule}</span>
                  <div className="flex text-yellow-500 items-center">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold text-slate-400 ml-1">4.9</span>
                  </div>
                </div>
                
                <h3 
                  className="text-lg font-bold text-slate-950 dark:text-white mb-2 leading-tight hover:text-pitaya transition-colors cursor-pointer line-clamp-1" 
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.name}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">₹{product.price}</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-0.5">/{product.unit}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-3 bg-cactus/10 text-cactus hover:bg-cactus hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCT DETAIL MODAL ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-10 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-450 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square bg-slate-50 dark:bg-slate-950 w-full">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                </div>
                
                <div className="p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="badge-cactus">{selectedProduct.category}</span>
                      <span className="text-xs font-bold text-slate-400">{selectedProduct.schedule}</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white mb-4 leading-tight">{selectedProduct.name}</h2>
                    <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed mb-6">{selectedProduct.description}</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl mb-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Booking Price</span>
                          <span className="text-3xl font-black text-slate-950 dark:text-white">₹{selectedProduct.price}</span>
                          <span className="text-xs font-bold text-slate-400 ml-1">per {selectedProduct.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Estimated Stock</span>
                          <span className="text-sm font-black text-cactus">{selectedProduct.stock} {selectedProduct.unit}s left</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Pincode checker */}
                    <div className="mb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                      <form onSubmit={checkDeliveryPincode} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Check Pincode (e.g. 228001)..."
                          value={pincodeQuery}
                          onChange={(e) => setPincodeQuery(e.target.value)}
                          className="flex-grow px-4 py-2 text-xs bg-slate-100 dark:bg-slate-950 rounded-xl outline-none font-semibold border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                        />
                        <button type="submit" className="px-4 py-2 bg-slate-850 hover:bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer">
                          Verify
                        </button>
                      </form>
                      {deliveryStatus && (
                        <p className={`text-xs mt-2 font-bold ${deliveryStatus.startsWith('✓') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {deliveryStatus}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                      className="w-full btn-primary py-4 text-base"
                    >
                      <ShoppingCart size={18} />
                      <span>Add to Shop Basket</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CART SIDEBAR ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[300] bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {checkoutStep === 'success' ? 'Booking Success!' : 'Farming Basket'}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {cart.reduce((s,i)=>s+i.quantity,0)} Items Selected
                </p>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); setDeliveryStatus(null); }} 
                className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
              {checkoutStep === 'cart' && (
                <div className="space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="bg-slate-50 dark:bg-slate-950 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 text-slate-350 dark:text-slate-650">
                        <ShoppingCart size={28} />
                      </div>
                      <p className="text-sm font-bold text-slate-400">Basket is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                            <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                            <div className="flex-grow">
                              <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                              <p className="text-xs font-black text-cactus mt-0.5">₹{item.price} <span className="text-[10px] text-slate-400">/{item.unit}</span></p>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-0.5">
                                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-850 rounded"><Minus size={10}/></button>
                                  <span className="w-6 text-center font-bold text-xs dark:text-white">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-850 rounded"><Plus size={10}/></button>
                                </div>
                                <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-[10px] font-bold text-red-400 hover:text-red-500 cursor-pointer">Remove</button>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-black text-xs text-slate-900 dark:text-white">₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Plant Discount Banner if eligible */}
                      {plantDiscountEligibility ? (
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-850 rounded-2xl p-4 flex items-start gap-2.5">
                          <Percent className="text-cactus shrink-0 mt-0.5" size={16} />
                          <div>
                            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Bulk Discount Applied!</p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400/80 mt-0.5">You unlocked a 15% discount on all plant saplings and cuttings.</p>
                          </div>
                        </div>
                      ) : (
                        cart.some(i => i.category === 'Live Plant') && (
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-start gap-2.5">
                            <Info className="text-slate-400 shrink-0 mt-0.5" size={16} />
                            <div className="text-[10px] text-slate-450">
                              <p className="font-bold">Unlock 15% Plant Discount</p>
                              <p className="mt-0.5">Add {10 - totalPlantsQuantity} more plant cuttings to activate the bulk discount rate.</p>
                            </div>
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              )}

              {checkoutStep === 'address' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <MapPin size={18} className="text-cactus" />
                    <span>Booking Delivery Address</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3.5">
                    <AddressInput label="Consignee Full Name" value={address.name} onChange={(v) => setAddress({...address, name: v})} colSpan={2} />
                    <AddressInput label="Phone Number" value={address.phone} onChange={(v) => setAddress({...address, phone: v})} />
                    <AddressInput label="Postal Pincode" value={address.pincode} onChange={(v) => setAddress({...address, pincode: v})} />
                    <AddressInput label="City/Town" value={address.city} onChange={(v) => setAddress({...address, city: v})} />
                    <AddressInput label="Full Delivery Address" value={address.street} onChange={(v) => setAddress({...address, street: v})} colSpan={2} />
                  </div>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <CreditCard size={18} className="text-cactus" />
                    <span>Booking Payment Options</span>
                  </h3>
                  <div className="space-y-3">
                    <div 
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                        paymentMethod === 'cod' ? 'border-cactus bg-cactus/5 dark:bg-emerald-950/20' : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-cactus' : 'border-slate-300'}`}>
                          {paymentMethod === 'cod' && <div className="w-2 h-2 bg-cactus rounded-full" />}
                        </div>
                        <span className="text-xs font-bold dark:text-white">Pay Cash on Delivery (COD)</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">Standard</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                        paymentMethod === 'upi' ? 'border-cactus bg-cactus/5 dark:bg-emerald-950/20' : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-cactus' : 'border-slate-300'}`}>
                          {paymentMethod === 'upi' && <div className="w-2 h-2 bg-cactus rounded-full" />}
                        </div>
                        <span className="text-xs font-bold dark:text-white">Instant UPI (Pay via PhonePe / GPay)</span>
                      </div>
                      <span className="text-[9px] font-bold text-cactus">Express Process</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-[10px] text-slate-500 leading-relaxed">
                    <p className="font-bold flex items-center gap-1 mb-1 text-slate-700 dark:text-slate-300">
                      <Truck size={12} /> Direct Farm Delivery
                    </p>
                    <span>We process and hand-pack your cuttings in high-grade moisture retention coco-peat. Deliveries are dispatched twice weekly.</span>
                  </div>
                </div>
              )}

              {checkoutStep === 'upi-scan' && (
                <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-150 dark:border-slate-850 inline-block">
                    <QrCode size={160} className="mx-auto text-slate-900 dark:text-white" />
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Scan QR to Book Cuttings</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Scan using BHIM, PhonePe, Paytm, or Google Pay.</p>
                    <p className="text-base font-black text-cactus mt-3">Pay Amount: ₹{cartTotal}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-2">
                    <button 
                      onClick={simulateUpiPayment}
                      disabled={isUpiSimulating}
                      className="w-full btn-primary py-3.5 text-sm cursor-pointer"
                    >
                      {isUpiSimulating ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Verifying Payment Approved...
                        </span>
                      ) : (
                        "I Have Scanned & Paid"
                      )}
                    </button>
                    <button 
                      onClick={() => setCheckoutStep('payment')}
                      className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-2 cursor-pointer"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-10">
                  <div className="bg-cactus w-20 h-20 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-cactus/10">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Booking Confirmed!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-xs mx-auto">
                    We have successfully registered your dragon fruit order. View the tracking status or download receipts directly from your farming dashboard.
                  </p>
                  <div className="space-y-3">
                    <button 
                      onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} 
                      className="w-full btn-primary py-3.5"
                    >
                      Done
                    </button>
                    <Link to="/dashboard" onClick={() => setIsCartOpen(false)} className="w-full btn-secondary py-3.5">
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Footer (Calculations & Triggers) */}
            {checkoutStep !== 'success' && checkoutStep !== 'upi-scan' && cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-850 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{rawSubtotal}</span>
                  </div>
                  {plantDiscountEligibility && (
                    <div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span>15% Plant Discount</span>
                      <span>-₹{plantDiscountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Shipping fee</span>
                    <span className="text-cactus">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-850 mt-1">
                    <span>Total Amount</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' && (
                  <button 
                    onClick={() => {
                      const user = localStorage.getItem('user');
                      if (!user) {
                        alert('Please login to place an order.');
                        return;
                      }
                      setCheckoutStep('address');
                    }} 
                    className="w-full btn-primary py-4 text-sm"
                  >
                    <span>Proceed to Delivery Info</span>
                    <ChevronRight size={16} />
                  </button>
                )}
                {checkoutStep === 'address' && (
                  <button 
                    onClick={() => {
                      if (!address.name || !address.phone || !address.city || !address.pincode || !address.street) {
                        alert('Please fill out all address fields.');
                        return;
                      }
                      setCheckoutStep('payment');
                    }}
                    className="w-full btn-primary py-4 text-sm"
                  >
                    <span>Proceed to Payment</span>
                  </button>
                )}
                {checkoutStep === 'payment' && (
                  <button 
                    onClick={() => {
                      if (paymentMethod === 'upi') {
                        startUpiFlow();
                      } else {
                        handlePlaceOrder('cod');
                      }
                    }} 
                    className="w-full btn-primary py-4 text-sm"
                  >
                    {paymentMethod === 'upi' ? "Pay via UPI QR Code" : "Book with Cash on Delivery (COD)"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AddressInput({ label, value, onChange, colSpan = 1 }: { label: string, value: string, onChange: (v: string) => void, colSpan?: number }) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-slate-55 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-850 rounded-xl outline-none focus:ring-2 focus:ring-cactus/20 font-bold text-xs dark:text-white"
        required
      />
    </div>
  );
}
