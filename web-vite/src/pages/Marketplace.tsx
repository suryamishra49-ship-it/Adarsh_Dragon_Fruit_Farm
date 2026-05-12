import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Search, Filter } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  category: 'Fruit' | 'Live Plant';
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Premium Red Dragon Fruit', price: 150, unit: 'kg', image: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=500', description: 'Fresh, organic, and sweet red pitaya.', category: 'Fruit' },
    { id: 2, name: 'Dragon Fruit Grafted Plant', price: 450, unit: 'pot', image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=500', description: 'Healthy grafted plant ready for plantation.', category: 'Live Plant' },
    { id: 3, name: 'Yellow Dragon Fruit (XL)', price: 280, unit: 'kg', image: 'https://images.unsplash.com/photo-1550258114-189a79444811?w=500', description: 'Exotic yellow skin with sweet white flesh.', category: 'Fruit' },
    { id: 4, name: 'Hylocereus Undatus Cutting', price: 80, unit: 'piece', image: 'https://images.unsplash.com/photo-1621506289937-9ccc14d599d0?w=500', description: 'High-yield variety cuttings for propagation.', category: 'Live Plant' },
  ]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = products.filter(p => 
    (category === 'All' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="gradient-pink-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md mb-6">
            Dragon Fruit & <span className="text-gray-800">Live Plants</span>
          </h1>
          <div className="max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search for fruits or plants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl shadow-xl border-none outline-none focus:ring-4 focus:ring-cactus/20 transition-all text-lg pl-14"
            />
            <Search className="absolute left-5 top-4.5 text-gray-400 group-focus-within:text-pitaya transition-colors" size={24} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {['All', 'Fruit', 'Live Plant'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                category === cat 
                ? 'bg-cactus text-white shadow-lg shadow-cactus/30' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}s
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 group">
              <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-cactus">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{product.name}</h3>
                <div className="flex items-center space-x-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />)}
                  <span className="text-xs text-gray-400">(24)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-pitaya">
                    ₹{product.price} <span className="text-sm font-normal text-gray-400">/ {product.unit}</span>
                  </div>
                  <button className="p-3 bg-cactus/10 text-cactus rounded-2xl hover:bg-cactus hover:text-white transition-all shadow-sm">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail & Review Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}

function ProductDetailModal({ product, onClose }: { product: Product, onClose: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, userName: 'Aditya S.', rating: 5, comment: 'The fruit was extremely fresh and sweet! Best quality.', date: '2 days ago' },
    { id: 2, userName: 'Megha P.', rating: 4, comment: 'Very healthy plant received. Packing was great.', date: '1 week ago' },
  ]);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }
    const newReview: Review = {
      id: Date.now(),
      userName: user.name || 'Anonymous',
      rating,
      comment,
      date: 'Just now'
    };
    setReviews([newReview, ...reviews]);
    setComment('');
    setRating(5);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden relative my-8">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors">
          <Filter className="rotate-45" size={24} /> {/* Using Filter as X placeholder if X not imported correctly, but I'll use a div/span if needed */}
          <span className="sr-only">Close</span>
          <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold text-xl">×</div>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-[300 md:h-auto] bg-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 md:p-12 overflow-y-auto max-h-[80vh]">
            <h2 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h2>
            <div className="text-3xl font-bold text-pitaya mb-6">₹{product.price} <span className="text-lg font-normal text-gray-400">/ {product.unit}</span></div>
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
            
            <button className="w-full btn-primary py-4 mb-12 text-lg shadow-xl shadow-cactus/20">
              Add to Cart
            </button>

            <div className="border-t pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Customer Reviews</h3>
              
              {/* Review Form */}
              {user && (
                <form onSubmit={handleSubmitReview} className="mb-10 bg-gray-50 p-6 rounded-2xl">
                  <p className="font-semibold text-sm mb-3">Leave a review</p>
                  <div className="flex space-x-2 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => setRating(s)}
                        className={`transition-colors ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star size={24} fill={s <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-pitaya min-h-[100px] mb-4"
                    required
                  />
                  <button type="submit" className="bg-pitaya text-white px-6 py-2 rounded-xl font-bold">
                    Submit Review
                  </button>
                </form>
              )}

              {/* Review List */}
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{review.userName}</p>
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
