import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { SAMPLE_PRODUCTS, SAMPLE_ORDERS } from '../constants';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <StoreContext.Provider value={{ 
      products, 
      orders, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      updateOrderStatus,
      deleteOrder 
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
