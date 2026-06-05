import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../services/storeContext';
import { Product, ProductVariant, PriceTier } from '../../types';
import { Save, ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { RichTextEditor } from '../../components/admin/RichTextEditor';

const emptyPriceTier: PriceTier = {
  condition: 'New Official',
  price: 0,
  stock: 'ready'
};

const emptyVariant: ProductVariant = {
  id: '',
  storage: '',
  color: '',
  sku: '',
  image: '',
  prices: [{ ...emptyPriceTier }]
};

const initialProduct: Product = {
  id: '',
  name: '',
  slug: '',
  brand: 'Apple',
  category: 'Phone',
  description: '',
  specs: {},
  baseImage: '',
  variants: [],
  releaseYear: new Date().getFullYear(),
  isFeatured: false,
  metaTitle: '',
  metaDescription: '',
  warranty: ''
};

export const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useStore();
  
  const [formData, setFormData] = useState<Product>(initialProduct);
  const [specsList, setSpecsList] = useState<{key: string, value: string}[]>([]);
  
  // State for collapsible variants. Stores the index of the currently expanded variant.
  const [expandedVariantIndex, setExpandedVariantIndex] = useState<number | null>(0);

  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData(structuredClone(product)); // Modern deep copy
        setSpecsList(Object.entries(product.specs).map(([key, value]) => ({ key, value })));
      }
    } else {
        // Initialize with one empty variant for convenience
        setFormData({
            ...initialProduct, 
            id: `p${Date.now()}`,
            variants: [{...emptyVariant, id: `v${Date.now()}`}]
        });
    }
  }, [id, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Specs Handling
  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specsList];
    newSpecs[index][field] = value;
    setSpecsList(newSpecs);
  };
  
  const addSpec = () => setSpecsList([...specsList, { key: '', value: '' }]);
  const removeSpec = (index: number) => setSpecsList(specsList.filter((_, i) => i !== index));

  // Variant Handling
  const addVariant = () => {
    const newIndex = formData.variants.length;
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ...emptyVariant, id: `v${Date.now()}` }]
    }));
    setExpandedVariantIndex(newIndex); // Auto-expand new variant
  };

  const removeVariant = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling accordion when clicking delete
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
    if (expandedVariantIndex === index) setExpandedVariantIndex(null);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const toggleVariant = (index: number) => {
    setExpandedVariantIndex(prev => prev === index ? null : index);
  };

  // Price Tier Handling (Nested in Variant)
  const addPriceTier = (variantIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].prices.push({ ...emptyPriceTier });
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const removePriceTier = (variantIndex: number, priceIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].prices = newVariants[variantIndex].prices.filter((_, i) => i !== priceIndex);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const updatePriceTier = (variantIndex: number, priceIndex: number, field: keyof PriceTier, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].prices[priceIndex] = { 
        ...newVariants[variantIndex].prices[priceIndex], 
        [field]: value 
    };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert specs list back to object
    const specsObj = specsList.reduce((acc, curr) => {
        if(curr.key) acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    const productToSave = {
        ...formData,
        specs: specsObj,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-') // Simple slug gen
    };

    if (id) {
      updateProduct(id, productToSave);
    } else {
      addProduct(productToSave);
    }
    navigate('/admin/products');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{id ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                    <input 
                        type="text" name="name" required value={formData.name} onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                    <select name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none">
                        {['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                     <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none">
                        {['Phone', 'Tablet', 'Watch', 'Accessory'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Release Year</label>
                    <input 
                        type="number" name="releaseYear" required value={formData.releaseYear} onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Warranty Info</label>
                    <input 
                        type="text" name="warranty" value={formData.warranty || ''} onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
                        placeholder="e.g. 1 Year Official"
                    />
                </div>
                 <div className="flex items-center pt-6">
                     <label className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleCheckboxChange} className="w-5 h-5 text-blue-600 rounded" />
                         <span className="text-slate-700 font-medium">Feature on Homepage</span>
                     </label>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <RichTextEditor 
                      value={formData.description} 
                      onChange={(val) => setFormData(prev => ({...prev, description: val}))} 
                    />
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Main Image URL</label>
                    <input 
                        type="url" name="baseImage" required value={formData.baseImage} onChange={handleChange}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
        </section>

         {/* SEO Settings */}
         <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">SEO Settings</h2>
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                    <input 
                        type="text" name="metaTitle" value={formData.metaTitle || ''} onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Title to appear in search engines"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                    <textarea 
                        name="metaDescription" rows={3} value={formData.metaDescription || ''} onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Description for search results"
                    />
                </div>
            </div>
        </section>

        {/* Specifications */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                 <h2 className="text-lg font-bold text-slate-900">Specifications</h2>
                 <button type="button" onClick={addSpec} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                     <Plus size={16} /> Add Spec
                 </button>
            </div>
            <div className="space-y-3">
                {specsList.map((spec, index) => (
                    <div key={index} className="flex gap-4">
                        <input 
                            type="text" placeholder="Spec Name (e.g. Chipset)" value={spec.key} 
                            onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                         <input 
                            type="text" placeholder="Value (e.g. A17 Pro)" value={spec.value} 
                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                        <button type="button" onClick={() => removeSpec(index)} className="text-slate-400 hover:text-red-500">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </section>

        {/* Variants & Pricing */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
                 <div>
                    <h2 className="text-lg font-bold text-slate-900">Variants & Pricing</h2>
                    <p className="text-sm text-slate-500">Manage SKUs, storage options, and prices per condition.</p>
                 </div>
                 <button type="button" onClick={addVariant} className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                     <Plus size={16} /> Add Variant
                 </button>
            </div>
            
            <div className="space-y-4">
                {formData.variants.map((variant, vIndex) => {
                    const isExpanded = expandedVariantIndex === vIndex;
                    const variantTitle = variant.storage && variant.color 
                        ? `${variant.storage} - ${variant.color}` 
                        : `New Variant ${vIndex + 1}`;
                    
                    return (
                        <div key={variant.id || vIndex} className="border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                            {/* Variant Header / Toggle */}
                            <div 
                                onClick={() => toggleVariant(vIndex)}
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-white border border-slate-200 p-1 rounded-md text-slate-500">
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {variant.image && (
                                            <img src={variant.image} alt="" className="w-8 h-8 object-cover rounded border border-slate-200" />
                                        )}
                                        <span className={`font-semibold text-sm ${!variant.storage ? 'text-slate-400 italic' : 'text-slate-800'}`}>
                                            {variantTitle}
                                        </span>
                                    </div>
                                    {variant.sku && <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded">SKU: {variant.sku}</span>}
                                </div>
                                <button 
                                    type="button" 
                                    onClick={(e) => removeVariant(vIndex, e)} 
                                    className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                                    title="Delete Variant"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Collapsible Content */}
                            {isExpanded && (
                                <div className="p-4 border-t border-slate-200 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Storage</label>
                                            <input 
                                                type="text" placeholder="e.g. 128GB" value={variant.storage}
                                                onChange={(e) => updateVariant(vIndex, 'storage', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Color</label>
                                            <input 
                                                type="text" placeholder="e.g. Blue Titanium" value={variant.color}
                                                onChange={(e) => updateVariant(vIndex, 'color', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">RAM (Optional)</label>
                                            <input 
                                                type="text" placeholder="e.g. 8GB" value={variant.ram || ''}
                                                onChange={(e) => updateVariant(vIndex, 'ram', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">SKU</label>
                                            <input 
                                                type="text" placeholder="e.g. IPH-15-128-BLU" value={variant.sku}
                                                onChange={(e) => updateVariant(vIndex, 'sku', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase flex items-center gap-2">
                                            <ImageIcon size={14} /> Variant Image (Optional)
                                        </label>
                                        <div className="flex gap-4 items-center">
                                            <input 
                                                type="text" placeholder="https://..." value={variant.image || ''}
                                                onChange={(e) => updateVariant(vIndex, 'image', e.target.value)}
                                                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
                                            />
                                            {variant.image && (
                                                <div className="w-10 h-10 border border-slate-200 rounded overflow-hidden flex-shrink-0">
                                                    <img src={variant.image} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">Leave empty to use the product's main image.</p>
                                    </div>

                                    {/* Prices within Variant */}
                                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-xs font-bold text-slate-600 uppercase">Prices & Stock Conditions</h4>
                                            <button type="button" onClick={() => addPriceTier(vIndex)} className="text-blue-600 text-xs font-medium hover:underline flex items-center gap-1">
                                                <Plus size={12} /> Add Condition
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {variant.prices.map((price, pIndex) => (
                                                <div key={pIndex} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                                                    <div className="md:col-span-4">
                                                        <select 
                                                            value={price.condition}
                                                            onChange={(e) => updatePriceTier(vIndex, pIndex, 'condition', e.target.value)}
                                                            className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm outline-none focus:border-blue-500"
                                                        >
                                                            {['New Official', 'New Inter', 'Second Ex-Box', 'Second Batangan'].map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-4">
                                                        <div className="relative">
                                                            <span className="absolute left-2 top-1.5 text-slate-400 text-xs">Rp</span>
                                                            <input 
                                                                type="number" placeholder="Price" value={price.price}
                                                                onChange={(e) => updatePriceTier(vIndex, pIndex, 'price', parseInt(e.target.value) || 0)}
                                                                className="w-full pl-8 pr-2 py-1.5 border border-slate-200 rounded text-sm outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <select 
                                                            value={price.stock}
                                                            onChange={(e) => updatePriceTier(vIndex, pIndex, 'stock', e.target.value)}
                                                            className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm outline-none focus:border-blue-500"
                                                        >
                                                            <option value="ready">Ready</option>
                                                            <option value="low">Low</option>
                                                            <option value="empty">Empty</option>
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-1 flex justify-end">
                                                        <button type="button" onClick={() => removePriceTier(vIndex, pIndex)} className="text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>

        <div className="flex justify-end pt-4">
            <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
                <Save size={20} /> Save Product
            </button>
        </div>

      </form>
    </div>
  );
};
