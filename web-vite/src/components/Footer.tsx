import { MessageCircle, Youtube, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-pitaya mb-4">Adarsh Dragon Fruit Farm</h3>
            <p className="text-gray-600 max-w-xs mx-auto md:mx-0">
              Fresh organic dragon fruits and live plants delivered straight from our farm to your home.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/" className="hover:text-pitaya">Home</a></li>
              <li><a href="/marketplace" className="hover:text-pitaya">Shop</a></li>
              <li><a href="/visit" className="hover:text-pitaya">Visit Farm</a></li>
              <li><a href="/gallery" className="hover:text-pitaya">Gallery</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Connect With Us</h4>
            <div className="flex justify-center md:justify-start space-x-6">
              <a href="https://wa.me/yournumber" className="text-green-500 hover:scale-110 transition-transform">
                <MessageCircle size={24} />
              </a>
              <a href="https://youtube.com/@yourchannel" className="text-red-500 hover:scale-110 transition-transform">
                <Youtube size={24} />
              </a>
              <a href="https://maps.google.com" className="text-blue-500 hover:scale-110 transition-transform">
                <MapPin size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Adarsh Dragon Fruit Farm. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
