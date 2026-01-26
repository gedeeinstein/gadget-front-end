import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../services/storeContext';
import { formatRupiah } from '../../constants';
import { Edit, Trash2, Plus, Search, Zap, X, Save } from 'lucide-react';
import { Product } from '../../types';

export const AdminProductList = () => {
  const { products, deleteProduct, updateProduct } = useStore();
  const navigate = useNavigate();
  
  // Quick Edit State
  const [quickEditProduct, setQuickEditProduct] = useState<Product | null>(null);
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const openQuickEdit = (product: Product) => {
    setQuickEditProduct(JSON.parse(JSON.stringify(product))); // Deep copy
  };

  const handleQuickSave = () => {
    if (quickEditProduct) {
      updateProduct(quickEditProduct.id, quickEditProduct);
      setQuickEditProduct(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <Link to="/admin/products/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Warranty Info</th>
                <th className="px-6 py-4 font-medium">Base Price</th>
                <th className="px-6 py-4 font-medium">Stock Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => {
                // Find lowest price
                const minPrice = Math.min(...product.variants.flatMap(v => v.prices.map(p => p.price)));
                
                // Aggregate stock status
                let hasReady = false;
                let hasLow = false;
                product.variants.forEach(v => {
                    v.prices.forEach(p => {
                        if (p.stock === 'ready') hasReady = true;
                        if (p.stock === 'low') hasLow = true;
                    })
                });
                
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={product.baseImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="font-medium text-slate-900">{product.name}</div>
                            <div className="text-xs text-slate-500">{product.variants.length} Variants</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.warranty || '-'}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{formatRupiah(minPrice)}</td>
                    <td className="px-6 py-4">
                        <div className="flex gap-1">
                            {hasReady && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">Ready</span>}
                            {hasLow && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">Low</span>}
                            {!hasReady && !hasLow && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">Empty</span>}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                          onClick={() => openQuickEdit(product)}
                          title="Quick Edit Status, Price, Warranty"
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Zap size={18} />
                        </button>
                        <Link to={`/admin/products/edit/${product.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && (
             <div className="p-10 text-center text-slate-500">No products found.</div>
          )}
        </div>
      </div>

      {/* Quick Edit Modal */}
      {quickEditProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h3 className="font-bold text-lg">Quick Edit: {quickEditProduct.name}</h3>
                    <button onClick={() => setQuickEditProduct(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                     {/* 1. Edit Warranty */}
                     <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Product Warranty</label>
                        <input 
                            type="text" 
                            value={quickEditProduct.warranty || ''} 
                            onChange={(e) => setQuickEditProduct({...quickEditProduct, warranty: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 1 Year Official"
                        />
                     </div>

                     {/* 2. Edit Variant Prices & Availability */}
                     <div>
                        <h4 className="font-bold text-slate-900 mb-3 text-sm">Variants, Prices & Availability</h4>
                        <div className="space-y-4">
                            {quickEditProduct.variants.map((variant, vIdx) => (
                                <div key={vIdx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                    <div className="mb-2 font-semibold text-sm text-slate-700 border-b border-slate-200 pb-1">
                                        {variant.storage} - {variant.color}
                                    </div>
                                    <div className="space-y-2">
                                        {variant.prices.map((price, pIdx) => (
                                            <div key={pIdx} className="flex gap-2 items-center text-sm">
                                                <div className="w-28 text-slate-500 truncate" title={price.condition}>{price.condition}</div>
                                                <div className="flex-1">
                                                    <input 
                                                        type="number" 
                                                        value={price.price}
                                                        onChange={(e) => {
                                                            const newVars = [...quickEditProduct.variants];
                                                            newVars[vIdx].prices[pIdx].price = parseInt(e.target.value) || 0;
                                                            setQuickEditProduct({...quickEditProduct, variants: newVars});
                                                        }}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded text-slate-900"
                                                        placeholder="Price"
                                                    />
                                                </div>
                                                <div className="w-24">
                                                     <select 
                                                        value={price.stock}
                                                        onChange={(e) => {
                                                            const newVars = [...quickEditProduct.variants];
                                                            newVars[vIdx].prices[pIdx].stock = e.target.value as any;
                                                            setQuickEditProduct({...quickEditProduct, variants: newVars});
                                                        }}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded cursor-pointer"
                                                     >
                                                         <option value="ready">Ready</option>
                                                         <option value="low">Low</option>
                                                         <option value="empty">Empty</option>
                                                     </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 rounded-b-xl">
                    <button 
                        onClick={() => setQuickEditProduct(null)}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleQuickSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
