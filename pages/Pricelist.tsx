import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../services/storeContext';
import { formatRupiah } from '../constants';
import { Search, Filter, ChevronDown, ChevronUp, Smartphone, Tablet, Watch, Laptop } from 'lucide-react';
import { Brand, Category, Condition } from '../types';

interface FlattenedProduct {
  productId: string;
  variantId: string;
  name: string;
  brand: Brand;
  category: Category;
  storage: string;
  color: string;
  ram?: string;
  condition: Condition;
  price: number;
  stock: 'ready' | 'low' | 'empty';
  image: string;
}

export const Pricelist = () => {
  const { products } = useStore();
  
  // Filters State
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<Brand | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedConditionGroup, setSelectedConditionGroup] = useState<'All' | 'New' | 'Second'>('Second');
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof FlattenedProduct; direction: 'asc' | 'desc' } | null>({ key: 'price', direction: 'asc' });

  // 1. Flatten Data: Convert Product -> Variants -> Prices into a single list of rows
  const flattenedData = useMemo(() => {
    const rows: FlattenedProduct[] = [];

    products.forEach(product => {
      product.variants.forEach(variant => {
        variant.prices.forEach(tier => {
          // Flattening logic
          rows.push({
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            storage: variant.storage,
            color: variant.color,
            ram: variant.ram,
            condition: tier.condition,
            price: tier.promoPrice || tier.price,
            stock: tier.stock,
            image: variant.image || product.baseImage
          });
        });
      });
    });
    return rows;
  }, [products]);

  // 2. Filter & Sort Data
  const filteredAndSortedData = useMemo(() => {
    let data = flattenedData;

    // Filter by Brand
    if (selectedBrand !== 'All') {
      data = data.filter(item => item.brand === selectedBrand);
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      data = data.filter(item => item.category === selectedCategory);
    }

    // Filter by Condition Group (Tab Logic)
    if (selectedConditionGroup === 'New') {
      data = data.filter(item => item.condition.includes('New'));
    } else if (selectedConditionGroup === 'Second') {
      data = data.filter(item => item.condition.includes('Second'));
    }

    // Filter by Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(item => 
        item.name.toLowerCase().includes(lowerSearch) || 
        item.storage.toLowerCase().includes(lowerSearch) ||
        item.color.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    if (sortConfig) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [flattenedData, selectedBrand, selectedCategory, selectedConditionGroup, search, sortConfig]);

  const handleSort = (key: keyof FlattenedProduct) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Real-time Pricelist</h1>
            <p className="text-slate-500 mt-2">Click categories below to navigate.</p>
        </div>

        {/* --- Top Filters (Dropdown Style) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Brand Select */}
            <div className="relative">
                <select 
                    value={selectedBrand} 
                    onChange={(e) => setSelectedBrand(e.target.value as any)}
                    className="w-full appearance-none bg-orange-100 border border-orange-200 text-slate-800 py-3 px-4 pr-8 rounded-lg font-medium outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
                >
                    <option value="All">All Brands</option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Vivo">Vivo</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-orange-600">
                    <ChevronDown size={16} />
                </div>
            </div>

            {/* Category Select */}
             <div className="relative">
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full appearance-none bg-orange-50 border border-orange-200 text-slate-800 py-3 px-4 pr-8 rounded-lg font-medium outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
                >
                    <option value="All">All Categories</option>
                    <option value="Phone">Phones</option>
                    <option value="Tablet">Tablets</option>
                    <option value="Watch">Watches</option>
                    <option value="Accessory">Accessories</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <ChevronDown size={16} />
                </div>
            </div>

            {/* Search Input */}
            <div className="col-span-2 relative">
                 <input 
                    type="text" 
                    placeholder="Search model, storage..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
                 />
                 <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
        </div>

        {/* --- Condition Tabs (Reference Style) --- */}
        <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 mb-0 rounded-t-xl overflow-hidden sm:bg-transparent">
            <button 
                onClick={() => setSelectedConditionGroup('New')}
                className={`flex-1 py-3 px-6 font-bold text-center transition-all
                    ${selectedConditionGroup === 'New' 
                        ? 'bg-orange-100 text-orange-800 border-b-4 border-orange-400' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                `}
            >
                Brand New
            </button>
            <button 
                onClick={() => setSelectedConditionGroup('Second')}
                className={`flex-1 py-3 px-6 font-bold text-center transition-all
                    ${selectedConditionGroup === 'Second' 
                        ? 'bg-[#005f88] text-white border-b-4 border-[#004466]' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                `}
            >
                Second Hand
            </button>
             <button 
                onClick={() => setSelectedConditionGroup('All')}
                className={`flex-1 py-3 px-6 font-bold text-center transition-all
                    ${selectedConditionGroup === 'All' 
                        ? 'bg-green-100 text-green-800 border-b-4 border-green-400' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                `}
            >
                All Conditions
            </button>
        </div>

        {/* --- Header Banner --- */}
        <div className="bg-[#0088cc] text-white py-3 px-6 text-center font-bold text-lg rounded-none sm:rounded-t-none">
            {selectedConditionGroup === 'New' ? 'Pricelist Baru / BNIB' : selectedConditionGroup === 'Second' ? 'Pricelist Second Original' : 'Complete Pricelist'}
        </div>

        {/* --- Data Table --- */}
        <div className="overflow-x-auto shadow-sm border-x border-b border-slate-200 bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#00aaff] text-white text-sm uppercase tracking-wider">
                        <th 
                            className="px-4 py-4 font-bold cursor-pointer hover:bg-white/10 transition-colors w-1/3"
                            onClick={() => handleSort('name')}
                        >
                            <div className="flex items-center gap-1">Tipe / Model {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</div>
                        </th>
                        <th className="px-4 py-4 font-bold hidden md:table-cell">Warna</th>
                        <th className="px-4 py-4 font-bold">Kapasitas</th>
                        <th className="px-4 py-4 font-bold hidden sm:table-cell">Kondisi</th>
                        <th 
                            className="px-4 py-4 font-bold text-right cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => handleSort('price')}
                        >
                             <div className="flex items-center justify-end gap-1">Harga {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredAndSortedData.map((item, idx) => (
                        <tr key={`${item.variantId}-${item.condition}-${idx}`} className="hover:bg-blue-50 transition-colors group">
                            <td className="px-4 py-3">
                                <Link to={`/product/${item.productId}`} className="flex items-center gap-3 group-hover:text-blue-600">
                                    <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 hidden sm:block">
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-semibold text-slate-800">{item.name}</span>
                                </Link>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-slate-600">
                                {item.color}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                                <span className="font-medium bg-slate-100 px-2 py-1 rounded text-xs">{item.storage}</span>
                                {item.ram && <span className="ml-2 text-xs text-slate-400">{item.ram}</span>}
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                                 <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border
                                    ${item.condition.includes('New') 
                                        ? 'bg-orange-50 text-orange-700 border-orange-100' 
                                        : 'bg-blue-50 text-blue-700 border-blue-100'}
                                 `}>
                                     {item.condition}
                                 </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="font-bold text-slate-900">{formatRupiah(item.price)}</div>
                                <div className={`text-[10px] ${item.stock === 'ready' ? 'text-green-600' : 'text-red-500'}`}>
                                    {item.stock === 'ready' ? 'Ready Stock' : 'Out of Stock'}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredAndSortedData.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                No products found matching your filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
};
