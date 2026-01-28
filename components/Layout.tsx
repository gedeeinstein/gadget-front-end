import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, Smartphone, ShieldCheck, MapPin, Phone, TableProperties } from 'lucide-react';
import { useCart } from '../services/cartContext';

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1"><MapPin size={12} /> Jakarta, Indonesia</span>
            <span className="flex items-center gap-1"><Phone size={12} /> +62 812 3456 7890</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link to="/about" className="hover:text-white">About Us</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Smartphone size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Anyelir<span className="text-blue-600">Gadget</span></span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/pricelist" className={isActive('/pricelist')}>Pricelist</Link>
              <Link to="/catalog" className={isActive('/catalog')}>Catalog</Link>
              <Link to="/services" className={isActive('/services')}>Services</Link>
              <Link to="/trade-in" className={isActive('/trade-in')}>Trade In</Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link to="/catalog" className="hidden md:block text-slate-500 hover:text-blue-600">
                <Search size={22} />
              </Link>
              <Link to="/cart" className="relative text-slate-500 hover:text-blue-600">
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button 
                className="md:hidden text-slate-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-slate-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/pricelist" className="text-slate-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Pricelist</Link>
              <Link to="/catalog" className="text-slate-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Catalog</Link>
              <Link to="/services" className="text-slate-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <Link to="/trade-in" className="text-slate-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Trade In</Link>
              <div className="border-t pt-4">
                 <input type="text" placeholder="Search products..." className="w-full bg-slate-100 p-2 rounded text-sm outline-none" />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">AnyelirGadget</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted partner for original gadgets. We provide warranty-backed new and second-hand devices at the best market prices.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/pricelist" className="hover:text-blue-400">Pricelist</Link></li>
              <li><Link to="/catalog" className="hover:text-blue-400">Catalog</Link></li>
              <li><Link to="/services" className="hover:text-blue-400">Repair Service</Link></li>
              <li><Link to="/trade-in" className="hover:text-blue-400">Trade In</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Lifetime Software Warranty</li>
              <li>Hardware Service</li>
              <li>Credit / Financing</li>
              <li>Device Protection</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Store Location</h4>
            <div className="flex items-start gap-2 text-sm text-slate-400">
              <MapPin size={16} className="mt-1 flex-shrink-0" />
              <p>Jl. Gadget Raya No. 123<br/>Jakarta Selatan, 12000<br/>Indonesia</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center px-4">
          <span>&copy; {new Date().getFullYear()} Anyelir Gadget Store. All rights reserved.</span>
          <Link to="/admin" className="mt-2 md:mt-0 hover:text-slate-300 transition-colors">Admin Login</Link>
        </div>
      </footer>
    </div>
  );
};
