import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Menu, X, Smartphone, Users } from 'lucide-react';
import { useStore } from '../../services/storeContext';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { logAction } = useStore();

  // Simulate logging a login event once per session
  useEffect(() => {
    const sessionKey = 'ag_admin_session_logged';
    if (!sessionStorage.getItem(sessionKey)) {
        logAction('Super Admin', 'System Login', 'Admin Dashboard', 'info');
        sessionStorage.setItem(sessionKey, 'true');
    }
  }, [logAction]);

  const isActive = (path: string) => location.pathname === path ? "bg-slate-800 text-blue-400" : "text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded">
              <Smartphone size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg">AG Admin</span>
          </Link>
          <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin')}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/products')}`}>
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/orders')}`}>
            <ShoppingBag size={20} />
            <span>Orders</span>
          </Link>
          <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')}`}>
            <Users size={20} />
            <span>Users</span>
          </Link>
          <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/settings')}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            <span>Exit to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <button className="lg:hidden text-slate-600" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
               AD
             </div>
             <span className="text-sm font-medium text-slate-700">Admin User</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
