import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Star, Search, X, 
  Heart, Share2, ChevronRight, Plus, Minus,
  CreditCard, MapPin, CheckCircle2, Package
} from 'lucide-react';
import bgDragonFruit from '../assets/bg-dragon-fruit.png';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  category: 'Fruit' | 'Live Plant';
  allowedPayments?: string[]; // ['cod', 'upi', 'card', 'netbanking']
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
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment' | 'success'>('cart');
  const [address, setAddress] = useState({ name: '', phone: '', city: '', pincode: '', street: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('farm_products') || '[]');
    if (stored.length > 0) {
      setProducts(stored);
    } else {
      const initial: Product[] = [
        { id: 1, name: 'Premium Red Dragon Fruit', price: 150, unit: 'kg', image: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=800', description: 'Fresh and sweet red pitaya.', category: 'Fruit', allowedPayments: ['cod', 'upi', 'card', 'netbanking'] },
        { id: 2, name: 'Dragon Fruit Grafted Plant', price: 450, unit: 'pot', image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800', description: 'Strong, healthy grafted plant.', category: 'Live Plant', allowedPayments: ['upi', 'card'] },
      ];
      setProducts(initial);
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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) {
      alert('Please login to place an order.');
      return;
    }

    const order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      userEmail: user.email,
      userName: address.name || user.name,
      items: cart,
      total: cartTotal,
      address,
      paymentMethod: checkoutStep === 'payment' ? 'cod' : '', // Mock for now
      status: 'Pending',
      trackingId: '',
      date: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem('farm_orders') || '[]');
    localStorage.setItem('farm_orders', JSON.stringify([order, ...existingOrders]));
    
    setCheckoutStep('success');
    setCart([]);
  };

  const filtered = products.filter(p => 
    (category === 'All' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20 font-sans">
      {/* ── PREMIUM HEADER ── */}
      <div className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-[-1]">
          <img 
            src={bgDragonFruit} 
            alt="Background" 
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-pitaya/20 to-white -z-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter">
              The <span className="text-cactus">Organic</span> Market
            </h1>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cactus transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Search fresh fruits, live plants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-6 bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 outline-none border-none focus:ring-4 focus:ring-cactus/10 transition-all text-lg font-medium"
              />
              <button 
                onClick={() => setIsCartOpen(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-cactus p-4 rounded-2xl text-white shadow-lg shadow-cactus/20 hover:scale-105 transition-transform flex items-center space-x-2"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && <span className="font-black text-sm">{cart.length}</span>}
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              {['All', 'Fruit', 'Live Plant'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all ${
                    category === cat 
                    ? 'bg-gray-900 text-white shadow-xl scale-105' 
                    : 'bg-white text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="container mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="p-3 bg-white/80 backdrop-blur-md rounded-2xl text-gray-400 hover:text-pitaya transition-colors shadow-lg">
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cactus bg-cactus/5 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex text-yellow-400">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold text-gray-400 ml-1">4.9</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-cactus transition-colors cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  {product.name}
                </h3>
                <p className="text-sm text-gray-400 font-medium line-clamp-2 mb-6">
                  {product.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                    <span className="text-xs text-gray-400 font-bold ml-1">/{product.unit}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-4 bg-gray-50 rounded-2xl text-cactus hover:bg-cactus hover:text-white transition-all group/btn shadow-sm"
                  >
                    <Plus size={20} className="group-hover/btn:rotate-90 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCT MODAL ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-8 right-8 z-10 p-3 bg-white/80 backdrop-blur-md rounded-2xl hover:bg-white transition-all shadow-lg"
            >
              <X size={24} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square bg-gray-100">
                <img src={selectedProduct.image} className="w-full h-full object-cover" />
              </div>
              <div className="p-12 flex flex-col">
                <div className="mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cactus bg-cactus/5 px-4 py-1.5 rounded-full">Premium Selection</span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-6 mb-4 leading-tight">{selectedProduct.name}</h2>
                  <p className="text-lg text-gray-500 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="bg-soft-green/30 p-8 rounded-[2rem] border border-cactus/10 mb-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Current Price</p>
                      <span className="text-4xl font-black text-gray-900">₹{selectedProduct.price}</span>
                      <span className="text-sm font-bold text-gray-400 ml-2">per {selectedProduct.unit}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">In Stock</p>
                      <span className="text-xl font-black text-cactus">50+ Units</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <button 
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className="w-full btn-primary py-5 text-xl flex items-center justify-center space-x-3"
                  >
                    <ShoppingCart size={24} />
                    <span>Add to Bag</span>
                  </button>
                  <button className="w-full py-5 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 flex items-center justify-center space-x-2">
                    <Share2 size={16} />
                    <span>Share with farmers</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* ── REVIEW SYSTEM ── */}
            <div className="bg-gray-50 border-t border-gray-100 p-12">
              <h3 className="text-2xl font-black text-gray-900 mb-8">Customer Reviews</h3>
              
              <div className="space-y-6 mb-8">
                {JSON.parse(localStorage.getItem(`reviews_${selectedProduct.id}`) || '[]').length === 0 ? (
                  <p className="text-gray-400 italic">No reviews yet. Be the first to review!</p>
                ) : (
                  JSON.parse(localStorage.getItem(`reviews_${selectedProduct.id}`) || '[]').map((rev: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= rev.rating ? 'currentColor' : 'none'} />)}
                        </div>
                        <span className="text-xs font-bold text-gray-400">- {rev.userName}</span>
                      </div>
                      <p className="text-gray-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {localStorage.getItem('user') ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const user = JSON.parse(localStorage.getItem('user') || '{}');
                  const comment = (e.target as any).elements[0].value;
                  const rating = 5; // Simplified for now
                  const newReview = { userName: user.name, comment, rating, date: new Date().toISOString() };
                  const reviews = JSON.parse(localStorage.getItem(`reviews_${selectedProduct.id}`) || '[]');
                  localStorage.setItem(`reviews_${selectedProduct.id}`, JSON.stringify([newReview, ...reviews]));
                  (e.target as any).reset();
                  setSelectedProduct({...selectedProduct}); // Trigger re-render
                }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">Leave a Review</h4>
                  <div className="flex items-center space-x-2 mb-4 text-yellow-400">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} fill="currentColor" className="cursor-pointer" />)}
                  </div>
                  <textarea 
                    placeholder="Share your experience with this product..."
                    className="w-full px-5 py-4 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-cactus/20 min-h-[100px] mb-4"
                    required
                  />
                  <button type="submit" className="btn-primary">Submit Review</button>
                </form>
              ) : (
                <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-500 font-medium">Please <Link to="/login" className="text-pitaya font-bold hover:underline">login</Link> to leave a review.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

      {/* ── CART & CHECKOUT SIDEBAR ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[300] bg-gray-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {checkoutStep === 'success' ? 'Order Confirmed!' : 'Your Basket'}
                </h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {cart.length} items selected
                </p>
              </div>
              <button onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
              {checkoutStep === 'cart' && (
                <div className="space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="bg-gray-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <ShoppingCart size={40} />
                      </div>
                      <p className="text-gray-400 font-bold">Your basket is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-6">
                        <img src={item.image} className="w-24 h-24 rounded-3xl object-cover" />
                        <div className="flex-grow">
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <p className="text-sm font-black text-cactus">₹{item.price} <span className="text-[10px] text-gray-400">/{item.unit}</span></p>
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center bg-gray-50 rounded-xl p-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white rounded-lg transition-colors"><Minus size={14}/></button>
                              <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white rounded-lg transition-colors"><Plus size={14}/></button>
                            </div>
                            <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-xs font-bold text-red-400 hover:text-red-600">Remove</button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {checkoutStep === 'address' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <MapPin size={20} className="text-cactus" />
                    <span>Delivery Address</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <AddressInput label="Full Name" value={address.name} onChange={(v) => setAddress({...address, name: v})} colSpan={2} />
                    <AddressInput label="Phone Number" value={address.phone} onChange={(v) => setAddress({...address, phone: v})} />
                    <AddressInput label="Pincode" value={address.pincode} onChange={(v) => setAddress({...address, pincode: v})} />
                    <AddressInput label="City" value={address.city} onChange={(v) => setAddress({...address, city: v})} />
                    <AddressInput label="Street / Landmark" value={address.street} onChange={(v) => setAddress({...address, street: v})} colSpan={2} />
                  </div>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-8">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard size={20} className="text-cactus" />
                    <span>Payment Method</span>
                  </h3>
                  <div className="space-y-4">
                    <PaymentOption 
                      id="cod" 
                      label="Cash on Delivery" 
                      selected 
                      disabled={cart.length > 0 && !cart.every(i => i.allowedPayments?.includes('cod'))}
                    />
                    <PaymentOption 
                      id="upi" 
                      label="UPI / PhonePe" 
                      disabled={cart.length > 0 && !cart.every(i => i.allowedPayments?.includes('upi'))}
                    />
                    <PaymentOption 
                      id="card" 
                      label="Credit / Debit Card" 
                      disabled={cart.length > 0 && !cart.every(i => i.allowedPayments?.includes('card'))}
                    />
                    <PaymentOption 
                      id="netbanking" 
                      label="Net Banking" 
                      disabled={cart.length > 0 && !cart.every(i => i.allowedPayments?.includes('netbanking'))}
                    />
                  </div>
                  <div className="p-6 bg-cactus/5 rounded-3xl border border-cactus/10">
                    <p className="text-sm text-cactus leading-relaxed">
                      <strong>Payment Availability:</strong> Some payment methods may be restricted depending on the items in your basket.
                    </p>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-12">
                  <div className="bg-cactus w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-cactus/20">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Order Successful!</h3>
                  <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    Thank you for shopping at Adarsh Farm. Your order has been placed and is being reviewed by our team.
                  </p>
                  <div className="space-y-4">
                    <button 
                      onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} 
                      className="w-full btn-primary py-4"
                    >
                      Continue Shopping
                    </button>
                    <button onClick={() => window.location.href = '/dashboard'} className="w-full py-4 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900">
                      View My Orders
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {checkoutStep !== 'success' && cart.length > 0 && (
              <div className="p-8 border-t border-gray-100 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-400">
                    <span>Shipping</span>
                    <span className="text-cactus font-black">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-50">
                    <span>Total Amount</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' && (
                  <button onClick={() => setCheckoutStep('address')} className="w-full btn-primary py-5 text-lg flex items-center justify-center space-x-3">
                    <span>Proceed to Checkout</span>
                    <ChevronRight size={20} />
                  </button>
                )}
                {checkoutStep === 'address' && (
                  <button onClick={() => setCheckoutStep('payment')} className="w-full btn-primary py-5 text-lg">Continue to Payment</button>
                )}
                {checkoutStep === 'payment' && (
                  <button onClick={handlePlaceOrder} className="w-full btn-primary py-5 text-lg flex items-center justify-center space-x-3">
                    <Package size={24} />
                    <span>Place Order (COD)</span>
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
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-3 bg-gray-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-cactus/20 font-medium text-sm"
        required
      />
    </div>
  );
}

function PaymentOption({ label, selected, disabled }: any) {
  return (
    <div className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between ${
      selected ? 'border-cactus bg-cactus/5' : 'border-gray-50 bg-gray-50/50'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="flex items-center space-x-4">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-cactus' : 'border-gray-200'}`}>
          {selected && <div className="w-2 h-2 bg-cactus rounded-full" />}
        </div>
        <span className={`font-bold ${selected ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
      </div>
      {disabled && <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Soon</span>}
    </div>
  );
}
