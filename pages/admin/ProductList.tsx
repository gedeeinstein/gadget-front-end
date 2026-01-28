import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../services/storeContext';
import { formatRupiah } from '../../constants';
import { Edit, Trash2, Plus, Search, Zap, X, Save, Upload, FileSpreadsheet, Download } from 'lucide-react';
import { Product, ProductVariant, PriceTier, Brand, Category, Condition } from '../../types';

export const AdminProductList = () => {
  const { products, deleteProduct, updateProduct, bulkAddProducts } = useStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Quick Edit State
  const [quickEditProduct, setQuickEditProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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

  // --- CSV Import Logic ---

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const parseCSVLine = (line: string): string[] => {
    // Basic CSV regex to handle commas inside quotes
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!matches) return line.split(',');
    return matches.map(m => m.replace(/^"|"$/g, ''));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const header = lines[0].toLowerCase().split(',').map(h => h.trim());
        
        // Expected headers: name, brand, category, description, baseImage, storage, color, condition, price, stock
        
        const tempProducts: Record<string, Product> = {};

        for (let i = 1; i < lines.length; i++) {
            // Simple split by comma, naive implementation. For robust CSV, use a library.
            // Assuming strict format for this feature:
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            
            // Map values based on assumed index (simple) or header mapping (better)
            // For simplicity in this demo, we assume fixed column order:
            // 0:name, 1:brand, 2:category, 3:description, 4:baseImage, 5:storage, 6:color, 7:condition, 8:price, 9:stock
            
            if (values.length < 9) continue;

            const name = values[0];
            const brand = values[1] as Brand;
            const category = values[2] as Category;
            const description = values[3];
            const baseImage = values[4];
            const storage = values[5];
            const color = values[6];
            const condition = values[7] as Condition;
            const price = parseInt(values[8]) || 0;
            const stock = (values[9] || 'ready') as 'ready' | 'low' | 'empty';

            const productKey = name.toLowerCase();

            if (!tempProducts[productKey]) {
                tempProducts[productKey] = {
                    id: `p-imp-${Date.now()}-${i}`,
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-'),
                    brand,
                    category,
                    description,
                    baseImage,
                    variants: [],
                    specs: {},
                    releaseYear: new Date().getFullYear(),
                    isFeatured: false
                };
            }

            // Find or Create Variant
            let variant = tempProducts[productKey].variants.find(v => v.storage === storage && v.color === color);
            
            if (!variant) {
                variant = {
                    id: `v-imp-${Date.now()}-${i}`,
                    storage,
                    color,
                    sku: `${name.substring(0,3).toUpperCase()}-${storage}-${color.substring(0,3).toUpperCase()}`,
                    prices: []
                };
                tempProducts[productKey].variants.push(variant);
            }

            // Add Price Tier
            variant.prices.push({
                condition,
                price,
                stock
            });
        }

        const newProducts = Object.values(tempProducts);
        
        if (newProducts.length > 0) {
            bulkAddProducts(newProducts);
            alert(`Successfully imported ${newProducts.length} products with ${lines.length - 1} rows of data.`);
        } else {
            alert("No valid product data found in CSV.");
        }

      } catch (error) {
        console.error("CSV Import Error", error);
        alert("Failed to parse CSV. Please check the format.");
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsText(file);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <div className="flex gap-2">
            <button 
                onClick={handleImportClick}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
                <Upload size={18} /> Import CSV
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv"
                className="hidden" 
            />
            <Link to="/admin/products/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
            <Plus size={18} /> Add Product
            </Link>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded text-blue-600">
            <FileSpreadsheet size={20} />
        </div>
        <div>
            <h4 className="text-sm font-bold text-blue-900">CSV Import Guide</h4>
            <p className="text-xs text-blue-700 mt-1">
                To import products, upload a CSV file with the following column order (no headers required, but recommended):<br/>
                <code className="bg-white px-1 rounded text-blue-800 border border-blue-200 mt-1 block w-fit">
                    name, brand, category, description, baseImage, storage, color, condition, price, stock
                </code>
                Multiple rows with the same name will be grouped into one product with variants.
            </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredProducts.map(product => {
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
          {filteredProducts.length === 0 && (
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
