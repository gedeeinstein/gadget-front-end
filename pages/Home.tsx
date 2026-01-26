import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, RefreshCw, Wrench, Shield, TrendingUp, CreditCard } from 'lucide-react';
import { useStore } from '../services/storeContext';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { products } = useStore();
  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Upgrade Your <span className="text-blue-400">Digital Life</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Find the best deals on the latest iPhones, Samsungs, and more. 
              Certified quality, official warranty, and trusted by thousands.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all flex items-center gap-2">
                Check Pricelist <ArrowRight size={18} />
              </Link>
              <Link to="/trade-in" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm font-semibold py-3 px-8 rounded-full transition-all border border-white/20">
                Trade In Device
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-12 bg-white -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Smartphone, label: 'New Phones', desc: 'Official Warranty', link: '/catalog?type=new' },
              { icon: RefreshCw, label: 'Second Hand', desc: 'Quality Check Passed', link: '/catalog?type=second' },
              { icon: Wrench, label: 'Repair Service', desc: 'Expert Technicians', link: '/services' },
              { icon: TrendingUp, label: 'Trade In', desc: 'Best Value', link: '/trade-in' },
            ].map((item, idx) => (
              <Link key={idx} to={item.link} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{item.label}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Products</h2>
              <p className="text-slate-500">Top picks for you this week</p>
            </div>
            <Link to="/catalog" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features/Trust */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Lifetime Warranty</h3>
                <p className="text-slate-500 text-sm">We provide lifetime software warranty and extensive hardware guarantee.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Easy Financing</h3>
                <p className="text-slate-500 text-sm">0% installment options available with major credit cards and financing partners.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">High Trade-in Value</h3>
                <p className="text-slate-500 text-sm">Get the best market price for your old device when upgrading with us.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
