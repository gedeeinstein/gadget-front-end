import React from 'react';
import { useStore } from '../../services/storeContext';
import { formatRupiah } from '../../constants';
import { TrendingUp, ShoppingBag, Package, Users } from 'lucide-react';

export const AdminDashboard = () => {
  const { orders, products } = useStore();

  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Sales</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatRupiah(totalSales)}</h3>
            </div>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-green-600 text-xs font-medium flex items-center gap-1">
            <span className="bg-green-100 px-1.5 py-0.5 rounded text-[10px]">+12%</span> from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalOrders}</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-slate-400 text-xs">{pendingOrders} pending orders</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalProducts}</h3>
            </div>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Package size={20} />
            </div>
          </div>
          <p className="text-slate-400 text-xs">In 4 categories</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Customers</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1,240</h3>
            </div>
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <p className="text-green-600 text-xs font-medium flex items-center gap-1">
            <span className="bg-green-100 px-1.5 py-0.5 rounded text-[10px]">+5%</span> new this week
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4">{formatRupiah(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-blue-100 text-blue-700'}
                      `}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Low Stock Alert (Mockup) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Low Stock Alert</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
               {products.slice(0,3).map((product) => (
                 <div key={product.id} className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                     <img src={product.baseImage} alt="" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                     <h4 className="font-medium text-slate-900">{product.name}</h4>
                     <p className="text-xs text-slate-500">{product.variants[0].storage} - {product.variants[0].color}</p>
                   </div>
                   <div className="text-right">
                     <span className="text-orange-600 font-bold text-sm">Low Stock</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
