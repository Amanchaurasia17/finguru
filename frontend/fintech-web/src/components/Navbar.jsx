import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react'; 
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-20 py-3 bg-transparent backdrop-blur-sm fixed top-0 z-50">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-white text-2xl font-bold">
        <div className="bg-green-400 text-black rounded-full w-10 h-10 flex items-center justify-center font-extrabold">
          FG
        </div>
        FinGURU
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-10 text-gray-300 font-medium text-lg">
        <Link to="/products" className="hover:text-green-400 transition">Products</Link>
        <Link to="/investments" className="hover:text-green-400 transition">Investments</Link>
        <Link to="/markets" className="hover:text-green-400 transition">Markets</Link>
        <Link to="/pricing" className="hover:text-green-400 transition">Pricing</Link>
      </div>

      {/* Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          to="/login"
          className="border border-green-400 text-green-400 px-5 py-2 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-400 hover:bg-green-500 text-black px-5 py-2 rounded-lg font-semibold transition"
        >
          Open Account
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
        <Menu size={28} />
      </button>

      {/* (Optional) Mobile Menu */}
      {/* add mobile menu dropdown later if you want */}
      
    </nav>
  );
}

