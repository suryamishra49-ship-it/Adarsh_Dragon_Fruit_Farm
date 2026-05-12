import { MessageCircle, Video, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-soft-green border-t border-cactus/10 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-farm-green mb-4">Adarsh Dragon Fruit Farm</h3>
            <p className="text-gray-600 max-w-xs mx-auto md:mx-0">
              Fresh premium dragon fruits and live plants delivered straight from our farm to your home.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li><a href="/" className="hover:text-cactus transition-colors">Home</a></li>
              <li><a href="/marketplace" className="hover:text-cactus transition-colors">Shop</a></li>
              <li><a href="/visit" className="hover:text-cactus transition-colors">Visit Farm</a></li>
              <li><a href="/gallery" className="hover:text-cactus transition-colors">Gallery</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Connect With Us</h4>
            <div className="flex justify-center md:justify-start space-x-6">
              <a href="https://wa.me/919628984643" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </a>
              <a href="https://www.youtube.com/@adarshdragonfruitfarm" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:scale-110 transition-transform">
                <Video size={28} />
              </a>
              <a href="https://share.google/QdglYxbhyAv7O8L0u" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition-transform">
                <MapPin size={28} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-cactus/10 text-center text-gray-500 text-sm font-medium">
          © {new Date().getFullYear()} Adarsh Dragon Fruit Farm. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
