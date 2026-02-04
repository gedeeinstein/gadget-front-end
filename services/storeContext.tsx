import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, OrderStatus, User, ActivityLog } from '../types';
import { api } from './api';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  users: User[];
  logs: ActivityLog[];
  isLoading: boolean;
  addProduct: (product: Product) => Promise<void>;
  bulkAddProducts: (products: Product[]) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  logAction: (user: string, action: string, target: string, type?: ActivityLog['type']) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [productsData, ordersData, usersData, logsData] = await Promise.all([
        api.products.getAll(),
        api.orders.getAll(),
        api.users.getAll(),
        api.logs.getAll()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);
      setLogs(logsData);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };
    init();
  }, []);

  const logAction = async (user: string, action: string, target: string, type: ActivityLog['type'] = 'info') => {
    try {
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          user,
          action,
          target,
          timestamp: new Date().toISOString(),
          type
        };
        // Optimistic update
        setLogs(prev => [newLog, ...prev]);
        await api.logs.create(newLog);
    } catch (e) {
        console.error("Failed to log action", e);
    }
  };

  // Product Actions
  const addProduct = async (product: Product) => {
    try {
        const created = await api.products.create(product);
        setProducts(prev => [created, ...prev]);
        await logAction('Super Admin', 'Created Product', product.name, 'success');
    } catch (e) {
        console.error("Failed to add product", e);
        throw e;
    }
  };

  const bulkAddProducts = async (newProducts: Product[]) => {
    try {
        // Mock bulk add by iterating (MirageJS/Mock Server limitation usually)
        await Promise.all(newProducts.map(p => api.products.create(p)));
        // Refresh full list to be safe
        const updatedProducts = await api.products.getAll();
        setProducts(updatedProducts);
        await logAction('Super Admin', 'Bulk Imported', `${newProducts.length} Products`, 'success');
    } catch (e) {
        console.error("Failed to bulk add products", e);
        throw e;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
        const updated = await api.products.update(id, updates);
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
        const productName = products.find(p => p.id === id)?.name || 'Unknown Product';
        await logAction('Super Admin', 'Updated Product', productName, 'info');
    } catch (e) {
        console.error("Failed to update product", e);
        throw e;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
        const productName = products.find(p => p.id === id)?.name || 'Unknown Product';
        await api.products.delete(id);
        setProducts(prev => prev.filter(p => p.id !== id));
        await logAction('Super Admin', 'Deleted Product', productName, 'danger');
    } catch (e) {
        console.error("Failed to delete product", e);
        throw e;
    }
  };

  // Order Actions
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
        const updated = await api.orders.updateStatus(id, status);
        setOrders(prev => prev.map(o => o.id === id ? updated : o));
        await logAction('Super Admin', 'Updated Status', `Order #${id} to ${status}`, 'warning');
    } catch (e) {
        console.error("Failed to update order status", e);
        throw e;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
        await api.orders.delete(id);
        setOrders(prev => prev.filter(o => o.id !== id));
        await logAction('Super Admin', 'Deleted Order', `#${id}`, 'danger');
    } catch (e) {
        console.error("Failed to delete order", e);
        throw e;
    }
  };

  // User Actions
  const addUser = async (user: User) => {
    try {
        const created = await api.users.create(user);
        setUsers(prev => [created, ...prev]);
        await logAction('Super Admin', 'Created User', user.name, 'success');
    } catch (e) {
        console.error("Failed to add user", e);
        throw e;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
        const updated = await api.users.update(id, updates);
        setUsers(prev => prev.map(u => u.id === id ? updated : u));
        await logAction('Super Admin', 'Updated User', `ID: ${id}`, 'info');
    } catch (e) {
        console.error("Failed to update user", e);
        throw e;
    }
  };

  const deleteUser = async (id: string) => {
    try {
        await api.users.delete(id);
        setUsers(prev => prev.filter(u => u.id !== id));
        await logAction('Super Admin', 'Deleted User', `ID: ${id}`, 'danger');
    } catch (e) {
        console.error("Failed to delete user", e);
        throw e;
    }
  };

  return (
    <StoreContext.Provider value={{ 
      products, 
      orders, 
      users,
      logs,
      isLoading,
      addProduct,
      bulkAddProducts,
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
