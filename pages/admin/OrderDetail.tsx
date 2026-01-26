import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../services/storeContext';
import { formatRupiah } from '../../constants';
import { ArrowLeft, Printer, Mail, Phone, MapPin, Package, User } from 'lucide-react';
import { OrderStatus } from '../../types';

export const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useStore();
  
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-4">The order ID #{id} does not exist.</p>
        <Link to="/admin/orders" className="text-blue-600 hover:underline">Return to Orders</Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    updateOrderStatus(order.id, newStatus as OrderStatus);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/orders')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    Order #{order.id}
                    <span className={`text-sm px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </h1>
                <p className="text-sm text-slate-500">{order.date} &bull; 10:32 AM</p>
            </div>
        </div>
        <div className="flex gap-2">
             <button 
                onClick={() => window.print()}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-50 transition-colors"
             >
                <Printer size={16} /> Print Invoice
             </button>
             <select 
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium outline-none cursor-pointer hover:bg-blue-700 transition-colors border-r-8 border-transparent"
            >
                <option className="text-slate-900 bg-white" value="Pending">Mark as Pending</option>
                <option className="text-slate-900 bg-white" value="Processing">Mark as Processing</option>
                <option className="text-slate-900 bg-white" value="Shipped">Mark as Shipped</option>
                <option className="text-slate-900 bg-white" value="Completed">Mark as Completed</option>
                <option className="text-slate-900 bg-white" value="Cancelled">Mark as Cancelled</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
              {/* Items Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <Package size={18} className="text-slate-400" /> Order Items
                      </h3>
                      <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{order.items.length} Items</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 font-medium">Product</th>
                                <th className="px-6 py-3 font-medium text-center">Qty</th>
                                <th className="px-6 py-3 font-medium text-right">Price</th>
                                <th className="px-6 py-3 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {order.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{item.name}</div>
                                                <div className="text-xs text-slate-500">{item.specSummary}</div>
                                                <div className="text-xs text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-0.5">{item.condition}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-600">x{item.quantity}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">{formatRupiah(item.price)}</td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900">{formatRupiah(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50">
                      <div className="flex justify-end gap-8 text-sm">
                          <div className="text-right space-y-1">
                              <p className="text-slate-500">Subtotal</p>
                              <p className="text-slate-500">Shipping Estimate</p>
                              <p className="font-bold text-lg text-slate-900 mt-2">Total</p>
                          </div>
                          <div className="text-right space-y-1">
                              <p className="font-medium text-slate-900">{formatRupiah(order.total)}</p>
                              <p className="font-medium text-slate-900">Rp 0</p>
                              <p className="font-bold text-lg text-blue-600 mt-2">{formatRupiah(order.total)}</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Order Timeline / Notes Placeholder */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Internal Notes</h3>
                  <textarea 
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                    placeholder="Add a note for this order..."
                  ></textarea>
                  <button className="mt-2 text-sm text-white bg-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                      Save Note
                  </button>
              </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              {/* Customer Details */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <User size={18} className="text-slate-400" /> Customer Details
                  </h3>
                  <div className="space-y-4">
                      <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                              {order.customerName.charAt(0)}
                          </div>
                          <div>
                              <p className="font-medium text-slate-900">{order.customerName}</p>
                              <p className="text-sm text-slate-500">Customer</p>
                          </div>
                      </div>
                      <div className="border-t border-slate-100 pt-4 space-y-3">
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                              <Mail size={16} className="text-slate-400" />
                              <a href="#" className="hover:text-blue-600">No email provided</a>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                              <Phone size={16} className="text-slate-400" />
                              <a href={`tel:${order.customerPhone}`} className="hover:text-blue-600">{order.customerPhone}</a>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Shipping Address (Mock) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <MapPin size={18} className="text-slate-400" /> Shipping Address
                  </h3>
                   <div className="text-sm text-slate-600 leading-relaxed">
                       <p className="font-medium text-slate-900 mb-1">{order.customerName}</p>
                       <p>Jl. Contoh Alamat No. 123</p>
                       <p>Kebayoran Baru, Jakarta Selatan</p>
                       <p>DKI Jakarta, 12150</p>
                       <p className="mt-2 text-slate-500 italic">Note: Address is mocked for this demo as it's not in the Order type yet.</p>
                   </div>
              </div>
          </div>
      </div>
    </div>
  );
};
