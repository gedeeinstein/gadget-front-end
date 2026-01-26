import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../services/cartContext';
import { formatRupiah, STORE_PHONE } from '../constants';
import { Trash2, ArrowLeft, MessageCircle } from 'lucide-react';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  const handleCheckout = () => {
    // Generate WhatsApp Checkout Message
    let message = `*NEW ORDER - CHECKOUT*\n\n`;
    items.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} (${item.specSummary})\n   Kondisi: ${item.condition}\n   Qty: ${item.quantity} x ${formatRupiah(item.price)}\n\n`;
    });
    message += `*TOTAL: ${formatRupiah(total)}*\n\nMohon info prosedur pembayaran dan pengiriman. Terima kasih.`;
    
    window.open(`https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <Trash2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added any gadgets yet.</p>
        <Link to="/catalog" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors">
          Browse Pricelist
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={`${item.variantId}-${item.condition}`} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 items-center">
                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <div className="text-sm text-slate-500">{item.specSummary} &bull; {item.condition}</div>
                  <div className="text-blue-600 font-bold mt-1">{formatRupiah(item.price)}</div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.variantId)}
                  className="text-slate-400 hover:text-red-500 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
              Clear Shopping Cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-xl border border-slate-200 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4 border-b border-slate-100 pb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span>{formatRupiah(total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-xs text-slate-400 italic">Calculated via WA</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-xl text-slate-900 mb-6">
                <span>Total</span>
                <span>{formatRupiah(total)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle size={20} /> Checkout via WhatsApp
              </button>
              <p className="text-xs text-center text-slate-400 mt-4">
                We will confirm stock availability and shipping costs via WhatsApp after checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
