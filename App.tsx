import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Pricelist } from './pages/Pricelist';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Services } from './pages/Services';
import { CartProvider } from './services/cartContext';
import { StoreProvider } from './services/storeContext';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProductList } from './pages/admin/ProductList';
import { AdminProductForm } from './pages/admin/ProductForm';
import { AdminOrderList } from './pages/admin/OrderList';
import { AdminOrderDetail } from './pages/admin/OrderDetail';
import { AdminUserList } from './pages/admin/UserList';

const App = () => {
  return (
    <StoreProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="pricelist" element={<Pricelist />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="services" element={<Services />} />
              <Route path="trade-in" element={<Services />} />
              <Route path="contact" element={<div className="p-20 text-center text-xl text-slate-500">Contact page placeholder</div>} />
              <Route path="about" element={<div className="p-20 text-center text-xl text-slate-500">About Us page placeholder</div>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProductList />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="orders" element={<AdminOrderList />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="users" element={<AdminUserList />} />
              <Route path="settings" element={<div className="p-10 font-bold text-slate-500">Settings Placeholder</div>} />
            </Route>
          </Routes>
        </HashRouter>
      </CartProvider>
    </StoreProvider>
  );
};

export default App;
