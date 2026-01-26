import React from 'react';
import { useStore } from '../../services/storeContext';
import { formatRupiah } from '../../constants';
import { Eye, Search } from 'lucide-react';
import { OrderStatus } from '../../types';
import { Link } from 'react-router-dom';

export const AdminOrderList = () => {
  const { orders, updateOrderStatus } = useStore();

  const handleStatusChange = (id: string, newStatus: string) => {
    updateOrderStatus(id, newStatus as OrderStatus);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Orders</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
           <div className="relative max-w-md w-full">
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">
                    <Link to={`/admin/orders/${order.id}`} className="hover:underline">{order.id}</Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{order.customerName}</td>
                  <td className="px-6 py-4 text-slate-600">{order.customerPhone}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatRupiah(order.total)}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer outline-none appearance-none ${getStatusColor(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/orders/${order.id}`} className="inline-block p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
             <div className="p-10 text-center text-slate-500">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
