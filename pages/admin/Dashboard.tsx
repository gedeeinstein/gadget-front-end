import React from 'react';
import { useStore } from '../../services/storeContext';
import { formatRupiah } from '../../constants';
import { TrendingUp, ShoppingBag, Package, Users, AlertTriangle, Activity, Clock } from 'lucide-react';
import { ActivityLog } from '../../types';

// Simple Bar Chart Component for Top Products
const SimpleBarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex flex-col gap-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3 text-sm">
          <div className="w-32 truncate text-slate-600 font-medium" title={item.label}>{item.label}</div>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-500 rounded-full transition-all duration-500" 
               style={{ width: `${(item.value / maxValue) * 100}%` }}
             ></div>
          </div>
          <div className="w-10 text-right font-bold text-slate-700">{item.value}</div>
        </div>
      ))}
      {data.length === 0 && <div className="text-slate-400 text-sm text-center">No sales data yet.</div>}
    </div>
  );
};

// Simple Sparkline Component (SVG) for cards
const Sparkline = ({ data, color = "#3b82f6" }: { data: number[], color?: string }) => {
    const height = 40;
    const width = 120;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    
    // Ensure we have at least 2 points to draw a line
    const plotData = data.length < 2 ? [0, ...data] : data;

    const points = plotData.map((val, i) => {
        const x = (i / (plotData.length - 1)) * width;
        const range = max - min || 1; 
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible opacity-50">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const LogItem = ({ log }: { log: ActivityLog }) => {
  const getColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-orange-100 text-orange-700';
      case 'danger': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${log.type === 'danger' ? 'bg-red-500' : log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">
          <span className="font-bold">{log.user}</span> {log.action.toLowerCase()} <span className="font-semibold text-slate-900">{log.target}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
           <Clock size={12} className="text-slate-400" />
           <span className="text-xs text-slate-500">{getTimeAgo(log.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const { orders, products, logs } = useStore();

  // --- Metrics Calculation ---
  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  
  // Logic to identify low stock items (condition specific)
  const lowStockProducts = products
    .flatMap(p => p.variants.flatMap(v => v.prices.map(price => ({ 
        id: `${p.id}-${v.id}-${price.condition}`,
        name: p.name, 
        variant: `${v.storage} ${v.color}`, 
        image: p.baseImage,
        condition: price.condition,
        stock: price.stock
    }))))
    .filter(item => item.stock === 'low' || item.stock === 'empty');

  const lowStockCount = lowStockProducts.length;

  // --- Mock Data Generation ---
  const salesTrendData = [12000000, 15000000, 11000000, 18000000, 22000000, 19000000, totalSales > 0 ? totalSales : 25000000];

  // 2. Top Selling Products
  const productSales: Record<string, number> = {};
  orders.forEach(order => {
      order.items.forEach(item => {
          if (!productSales[item.name]) productSales[item.name] = 0;
          productSales[item.name] += item.quantity;
      });
  });

  if (Object.keys(productSales).length === 0) {
      productSales['iPhone 15 Pro'] = 12;
      productSales['Samsung S24 Ultra'] = 8;
      productSales['Xiaomi 14'] = 5;
      productSales['iPad Air 5'] = 3;
      productSales['iPhone 13'] = 2;
  }
  
  const topProducts = Object.entries(productSales)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="pb-10">
       <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <div className="text-sm text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
       </div>
       
       {/* --- Key Metrics Grid --- */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {/* Total Sales */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
               <div className="flex justify-between items-start mb-4 relative z-10">
                   <div>
                       <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Sales</p>
                       <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatRupiah(totalSales)}</h3>
                   </div>
                   <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                       <TrendingUp size={20} />
                   </div>
               </div>
               <div className="h-10 relative z-10">
                   <Sparkline data={salesTrendData} color="#16a34a" />
               </div>
           </div>

           {/* Total Orders */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex justify-between items-start mb-2">
                   <div>
                       <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Orders</p>
                       <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalOrders}</h3>
                   </div>
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                       <ShoppingBag size={20} />
                   </div>
               </div>
               <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${pendingOrders > 0 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                    {pendingOrders} Pending
                  </span>
                  Processing
               </p>
           </div>

           {/* Low Stock */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex justify-between items-start mb-2">
                   <div>
                       <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Low Stock</p>
                       <h3 className="text-2xl font-bold text-slate-900 mt-1">{lowStockCount}</h3>
                   </div>
                   <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                       <AlertTriangle size={20} />
                   </div>
               </div>
               <p className="text-slate-500 text-sm mt-2">
                   Items need restocking
               </p>
           </div>

            {/* Total Customers (Mock) */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex justify-between items-start mb-2">
                   <div>
                       <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Customers</p>
                       <h3 className="text-2xl font-bold text-slate-900 mt-1">1,240</h3>
                   </div>
                   <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                       <Users size={20} />
                   </div>
               </div>
               <p className="text-green-600 text-sm font-medium mt-2 flex items-center gap-1">
                 <TrendingUp size={14} /> +12% this month
               </p>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* --- Main Content Area (2 Cols) --- */}
           <div className="lg:col-span-2 space-y-8">
               
               {/* Sales Analytics Chart */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-slate-900 text-lg">Weekly Sales Analytics</h3>
                       <select className="text-sm border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-600">
                           <option>Last 7 Days</option>
                           <option>Last 30 Days</option>
                       </select>
                   </div>
                   <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                        {/* CSS Bar Chart for daily sales */}
                        {[45, 65, 40, 80, 55, 90, 75].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end h-full group cursor-pointer">
                                <div className="relative w-full bg-blue-50 rounded-t-lg h-full overflow-hidden">
                                    <div 
                                        className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600" 
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                                <div className="text-center text-xs text-slate-400 mt-2 font-medium">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                </div>
                            </div>
                        ))}
                   </div>
               </div>

               {/* Activity Log */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                          <Activity size={20} className="text-blue-600" />
                          Activity Log
                        </h3>
                    </div>
                    <div className="p-6 max-h-[300px] overflow-y-auto custom-scrollbar space-y-4">
                        {logs.slice(0, 10).map(log => (
                          <LogItem key={log.id} log={log} />
                        ))}
                        {logs.length === 0 && <p className="text-slate-500 text-center text-sm">No activity recorded.</p>}
                    </div>
               </div>
           </div>

           {/* --- Sidebar Area (1 Col) --- */}
           <div className="space-y-8">
               
               {/* Top Products */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-900 text-lg mb-6">Top Selling Products</h3>
                   <SimpleBarChart data={topProducts} />
               </div>

               {/* Low Stock Alerts */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 text-lg">Low Stock Alerts</h3>
                        {lowStockCount > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{lowStockCount} Items</span>}
                   </div>
                   <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {lowStockProducts.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-slate-900 line-clamp-1" title={item.name}>{item.name}</h4>
                                    <p className="text-xs text-slate-500 truncate">{item.variant}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${item.stock === 'empty' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                            {item.condition}: {item.stock}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {lowStockCount === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                <Package size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">Stock levels are healthy.</p>
                            </div>
                        )}
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};
