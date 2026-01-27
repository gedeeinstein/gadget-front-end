import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../services/storeContext';
import { formatRupiah, STORE_PHONE } from '../constants';
import { ProductVariant, PriceTier } from '../types';
import { useCart } from '../services/cartContext';
import { Check, ShoppingCart, MessageCircle, ShieldCheck, Box, AlertCircle } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useStore();
  
  const product = products.find(p => p.id === id);
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedPriceTier, setSelectedPriceTier] = useState<PriceTier | null>(null);

  // Initialize selection
  useEffect(() => {
    if (product && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedVariant(defaultVariant);
      if (defaultVariant.prices.length > 0) {
        setSelectedPriceTier(defaultVariant.prices[0]);
      }
    }
  }, [product]);

  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }

  if (!selectedVariant || !selectedPriceTier) {
    return <div className="p-10 text-center">Loading product options...</div>;
  }

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
      // Try to maintain condition selection if possible, else default to first
      const sameCondition = variant.prices.find(p => p.condition === selectedPriceTier.condition);
      setSelectedPriceTier(sameCondition || variant.prices[0]);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      condition: selectedPriceTier.condition,
      name: product.name,
      image: product.baseImage,
      specSummary: `${selectedVariant.storage} - ${selectedVariant.color}`,
      price: selectedPriceTier.promoPrice || selectedPriceTier.price,
      quantity: 1
    });
    // Optional: Show toast
  };

  const handleWhatsAppOrder = () => {
    const message = `Halo Anyelir Gadget, saya mau order:\n\n*${product.name}*\nVariant: ${selectedVariant.storage} ${selectedVariant.color}\nKondisi: ${selectedPriceTier.condition}\nHarga: ${formatRupiah(selectedPriceTier.promoPrice || selectedPriceTier.price)}\n\nApakah stock tersedia?`;
    window.open(`https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-6">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Home</span> / 
          <span className="cursor-pointer hover:text-blue-600 mx-2" onClick={() => navigate('/catalog')}>Pricelist</span> / 
          <span className="text-slate-900">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="p-8 bg-slate-100 flex items-center justify-center relative">
              <img 
                src={product.baseImage} 
                alt={product.name} 
                className="max-h-[500px] w-auto object-contain mix-blend-multiply"
              />
            </div>

            {/* Info */}
            <div className="p-8 lg:p-12">
              <div className="mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full uppercase">{product.brand}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
              
              {/* Price Display */}
              <div className="mb-8">
                <div className="text-sm text-slate-500 mb-1">Price for {selectedPriceTier.condition}</div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatRupiah(selectedPriceTier.promoPrice || selectedPriceTier.price)}
                  </span>
                  {selectedPriceTier.promoPrice && (
                    <span className="text-lg text-slate-400 line-through mb-1">
                      {formatRupiah(selectedPriceTier.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Variant Selectors */}
              <div className="space-y-6 mb-8">
                {/* 1. Select Variant (Combined Storage/Color logic simplified for demo) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Available Variants</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantChange(v.id)}
                        className={`
                          p-3 rounded-lg border text-left text-sm transition-all
                          ${selectedVariant.id === v.id 
                            ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                            : 'border-slate-200 hover:border-slate-300'}
                        `}
                      >
                        <div className="font-bold text-slate-900">{v.storage}</div>
                        <div className="text-slate-500 text-xs">{v.color}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Select Condition */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
                  <div className="space-y-3">
                    {selectedVariant.prices.map((tier, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPriceTier(tier)}
                        className={`
                          w-full flex justify-between items-center p-4 rounded-xl border transition-all
                          ${selectedPriceTier.condition === tier.condition
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-slate-200 hover:border-slate-300'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPriceTier.condition === tier.condition ? 'border-blue-600' : 'border-slate-400'}`}>
                            {selectedPriceTier.condition === tier.condition && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                          </div>
                          <div className="text-left">
                            <span className="block font-medium text-slate-900">{tier.condition}</span>
                            <span className="block text-xs text-slate-500">
                              {tier.condition.includes('New') ? 'Segel Box, Garansi Aktif' : 'Fisik 90-98%, Fungsi Normal'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-slate-900">{formatRupiah(tier.promoPrice || tier.price)}</span>
                          <span className={`text-xs font-medium ${tier.stock === 'ready' ? 'text-green-600' : 'text-orange-500'}`}>
                            {tier.stock === 'ready' ? 'Ready Stock' : 'Low Stock'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart size={20} /> Add to Cart
                </button>
                <button 
                  onClick={handleWhatsAppOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={20} /> Order via WhatsApp
                </button>
              </div>

              {/* Specs Teaser */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Box size={16} /> <span>Original Authentic</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck size={16} /> <span>Warranty Guarantee</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed Info Tabs */}
          <div className="border-t border-slate-200 p-8 lg:p-12">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <div 
              className="text-slate-600 leading-relaxed mb-8 text-sm 
                [&>p]:mb-4 
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-2 
                [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-2 
                [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2
                [&>a]:text-blue-600 [&>a]:underline
                [&>blockquote]:border-l-4 [&>blockquote]:border-slate-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-4
              "
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            
            <h3 className="text-xl font-bold mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex border-b border-slate-100 py-2">
                  <span className="w-1/3 text-slate-500 font-medium">{key}</span>
                  <span className="w-2/3 text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
