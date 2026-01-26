import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../services/storeContext';
import { formatRupiah } from '../../constants';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

export const AdminProductList = () => {
  const { products, deleteProduct } = useStore();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
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
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Brand</th>
                <th className="px-6 py-4 font-medium">Base Price</th>
                <th className="px-6 py-4 font-medium">Variants</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => {
                // Find lowest price
                const minPrice = Math.min(...product.variants.flatMap(v => v.prices.map(p => p.price)));
                
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={product.baseImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.category}</td>
                    <td className="px-6 py-4 text-slate-600">{product.brand}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{formatRupiah(minPrice)}</td>
                    <td className="px-6 py-4 text-slate-600">{product.variants.length} Variants</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
    </div>
  );
};