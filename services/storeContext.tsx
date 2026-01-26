import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Order, OrderStatus, User, ActivityLog } from '../types';
import { SAMPLE_PRODUCTS, SAMPLE_ORDERS, SAMPLE_USERS } from '../constants';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  users: User[];
  logs: ActivityLog[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  logAction: (user: string, action: string, target: string, type?: ActivityLog['type']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial Mock Logs
const INITIAL_LOGS: ActivityLog[] = [
  { id: 'l1', user: 'Super Admin', action: 'System Login', target: 'Dashboard', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), type: 'info' },
  { id: 'l2', user: 'Super Admin', action: 'Updated Stock', target: 'iPhone 15 Pro', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'success' },
  { id: 'l3', user: 'Sales Staff', action: 'Created Order', target: '#ORD-004', timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), type: 'success' }
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

  const logAction = (user: string, action: string, target: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user,
      action,
      target,
      timestamp: new Date().toISOString(),
      type
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Product Actions
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    logAction('Super Admin', 'Created Product', product.name, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    const productName = products.find(p => p.id === id)?.name || 'Unknown Product';
    logAction('Super Admin', 'Updated Product', productName, 'info');
  };

  const deleteProduct = (id: string) => {
    const productName = products.find(p => p.id === id)?.name || 'Unknown Product';
    setProducts(prev => prev.filter(p => p.id !== id));
    logAction('Super Admin', 'Deleted Product', productName, 'danger');
  };

  // Order Actions
  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    logAction('Super Admin', 'Updated Status', `Order #${id} to ${status}`, 'warning');
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    logAction('Super Admin', 'Deleted Order', `#${id}`, 'danger');
  };

  // User Actions
  const addUser = (user: User) => {
    setUsers(prev => [user, ...prev]);
    logAction('Super Admin', 'Created User', user.name, 'success');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    logAction('Super Admin', 'Updated User', `ID: ${id}`, 'info');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    logAction('Super Admin', 'Deleted User', `ID: ${id}`, 'danger');
  };

  return (
    <StoreContext.Provider value={{ 
      products, 
      orders, 
      users,
      logs,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      updateOrderStatus,
      deleteOrder,
      addUser,
      updateUser,
      deleteUser,
      logAction
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
