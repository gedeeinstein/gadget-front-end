import React, { useState, useMemo } from 'react';
import { useStore } from '../services/storeContext';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, X } from 'lucide-react';
import { Brand } from '../types';

export const Catalog = () => {
  const { products } = useStore();
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<Brand | 'All'>('All');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'default'>('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const brands: Brand[] = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo'];

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedBrand === 'All' || p.brand === selectedBrand)
    );

    if (priceSort !== 'default') {
      result.sort((a, b) => {
        // Sort by lowest available price variant
        const minPriceA = Math.min(...a.variants.flatMap(v => v.prices.map(p => p.price)));
        const minPriceB = Math.min(...b.variants.flatMap(v => v.prices.map(p => p.price)));
        return priceSort === 'asc' ? minPriceA - minPriceB : minPriceB - minPriceA;
      });
    }

    return result;
  }, [products, search, selectedBrand, priceSort]);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pricelist Gadget</h1>
            <p className="text-slate-500 mt-1">Real-time prices for new and second-hand devices.</p>
          </div>
          
          <button 
            className="md:hidden flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filter (Desktop) */}
          <div className={`
            fixed inset-0 z-40 bg-white p-6 transform transition-transform duration-300 md:relative md:transform-none md:bg-transparent md:p-0 md:w-64 md:block
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            <div className="flex justify-between items-center md:hidden mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search model..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Brands</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="brand" 
                      checked={selectedBrand === 'All'} 
                      onChange={() => setSelectedBrand('All')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-600">All Brands</span>
                  </label>
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="brand" 
                        checked={selectedBrand === brand} 
                        onChange={() => setSelectedBrand(brand)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-600">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

               {/* Sort */}
               <div>
                <h3 className="font-bold text-slate-900 mb-3">Sort By</h3>
                <select 
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm"
                >
                  <option value="default">Popularity</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
                <button 
                  onClick={() => {setSearch(''); setSelectedBrand('All');}}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
