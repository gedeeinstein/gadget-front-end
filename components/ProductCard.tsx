import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatRupiah } from '../constants';
import { BadgeCheck, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Logic to find lowest price to display "Starts from"
  let lowestPrice = Infinity;
  let hasPromo = false;

  product.variants.forEach(v => {
    v.prices.forEach(p => {
      if (p.price < lowestPrice) lowestPrice = p.price;
      if (p.promoPrice) hasPromo = true;
    });
  });

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <img 
          src={product.baseImage} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hasPromo && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            PROMO
          </div>
        )}
        {product.brand === 'Apple' && (
          <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
            <BadgeCheck size={10} /> Apple Auth
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-slate-500 mb-1">{product.category} &bull; {product.brand}</div>
        <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="text-xs text-slate-500 mb-1">Starts from</div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-blue-600">
              {formatRupiah(lowestPrice)}
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};