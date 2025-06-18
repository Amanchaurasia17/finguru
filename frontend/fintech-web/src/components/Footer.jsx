import { Link } from 'react-router-dom';
import appStoreLogo from '../assets/appstore_logo.png';
import playStoreLogo from '../assets/play-store-logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#0A0F24] text-gray-300 py-10 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo and Social Links */}
        <div>
          <Link to="/" className="flex items-center gap-2 text-white text-2xl font-bold">
            <div className="bg-green-400 text-black rounded-full w-10 h-10 flex items-center justify-center font-extrabold">
              FG
            </div>
            FinGURU
          </Link>
          <p className="mt-4">Join us on</p>
          <Link to="/community" className="flex items-center gap-2 mt-2 text-white">
            <div className="bg-green-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
              FG
            </div>
            FinGURU Community
          </Link>
          <p className="mt-4">Follow us on</p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-green-400 transition">X</a>
            <a href="#" className="hover:text-green-400 transition">Telegram</a>
            <a href="#" className="hover:text-green-400 transition">LinkedIn</a>
            <a href="#" className="hover:text-green-400 transition">YouTube</a>
            <a href="#" className="hover:text-green-400 transition">Instagram</a>
            <a href="#" className="hover:text-green-400 transition">Facebook</a>
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-green-400 transition">Knowledge Base</Link></li>
            <li><Link to="#" className="hover:text-green-400 transition">Customer Support</Link></li>
            <li><Link to="#" className="hover:text-green-400 transition">Safety and Security</Link></li>
            <li><Link to="#" className="hover:text-green-400 transition">Grievance Redressal</Link></li>
          </ul>
        </div>

        {/* Our Products */}
        <div>
          <h3 className="text-white font-semibold mb-4">Our Products</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-green-400 transition">FinGURU App</Link></li>
            <li><Link to="#" className="hover:text-green-400 transition">FinGURU Web</Link></li>
            <li><Link to="#" className="hover:text-green-400 transition">Investment Tools</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/register" className="hover:text-green-400 transition">Open Account</Link></li>
            <li><Link to="#" className="hover:text-green-400 transition">Download App</Link></li>
            <li><Link to="#" className="hover:text-green-400 transition">Market Holidays</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-green-400 transition">About Us</Link></li>
            <li><Link to="#" className="hover:text-green-400 transition">Careers</Link></li>
            <li><Link to="#" className="hover:text-green-400 transition">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-400">
          Built with ❤️ for peoples who love to grow their wealth.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:opacity-80 transition">
            <img src={appStoreLogo} alt="App Store" className="h-10 " />
          </a>
          <a href="#" className="hover:opacity-80 transition">
            <img src={playStoreLogo} alt="Google Play" className="h-10" />
          </a>
        </div>
      </div>
    </footer>
  );
}