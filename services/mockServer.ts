import { createServer, Model, Response } from 'miragejs';
import { SAMPLE_PRODUCTS, SAMPLE_ORDERS, SAMPLE_USERS } from '../constants';
import { Product, Order, User, ActivityLog } from '../types';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      product: Model.extend<Partial<Product>>({}),
      order: Model.extend<Partial<Order>>({}),
      user: Model.extend<Partial<User>>({}),
      log: Model.extend<Partial<ActivityLog>>({}),
    },

    seeds(server) {
      // Seed Products
      SAMPLE_PRODUCTS.forEach((product) => {
        server.create('product', product as any);
      });

      // Seed Orders
      SAMPLE_ORDERS.forEach((order) => {
        server.create('order', order as any);
      });

      // Seed Users
      SAMPLE_USERS.forEach((user) => {
        server.create('user', user as any);
      });

      // Seed Logs (Empty initially or from constant if it existed, but context created it dynamically)
      // We will leave logs empty or add some dummy ones
      server.create('log', {
        id: 'l1',
        user: 'Super Admin',
        action: 'System Login',
        target: 'Dashboard',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        type: 'info'
      } as any);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 500; // Simulate network delay

      // Auth
      this.post('/login', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const user = schema.findBy('user', (u: any) => u.email === attrs.email);

        // Simple mock auth
        if (user && attrs.password === 'password') {
            return {
                user: user.attrs,
                token: 'mock-jwt-token-12345'
            };
        } else if (attrs.email === 'admin@demo.com' && attrs.password === 'admin') {
             // Backdoor for demo
             return {
                user: { id: 'u1', name: 'Super Admin', email: 'admin@demo.com', role: 'Admin' },
                token: 'mock-jwt-token-admin'
             };
        }

        return new Response(401, {}, { message: 'Invalid credentials' });
      });

      // Products
      this.get('/products', (schema) => {
        return schema.all('product').models.map(m => m.attrs);
      });

      this.get('/products/:id', (schema, request) => {
        const id = request.params.id;
        return schema.find('product', id)?.attrs;
      });

      this.post('/products', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('product', attrs).attrs;
      });

      this.put('/products/:id', (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody);
        const id = request.params.id;
        const product = schema.find('product', id);
        product?.update(newAttrs);
        return product?.attrs;
      });

      this.delete('/products/:id', (schema, request) => {
        const id = request.params.id;
        schema.find('product', id)?.destroy();
        return new Response(204);
      });

      // Orders
      this.get('/orders', (schema) => {
        return schema.all('order').models.map(m => m.attrs);
      });

      this.post('/orders', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('order', attrs).attrs;
      });

      this.put('/orders/:id', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const id = request.params.id;
        const order = schema.find('order', id);
        order?.update(attrs);
        return order?.attrs;
      });

      this.delete('/orders/:id', (schema, request) => {
        schema.find('order', request.params.id)?.destroy();
        return new Response(204);
      });

      // Users
      this.get('/users', (schema) => {
        return schema.all('user').models.map(m => m.attrs);
      });

      this.post('/users', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('user', attrs).attrs;
      });

      this.put('/users/:id', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const id = request.params.id;
        const user = schema.find('user', id);
        user?.update(attrs);
        return user?.attrs;
      });

      this.delete('/users/:id', (schema, request) => {
        schema.find('user', request.params.id)?.destroy();
        return new Response(204);
      });

      // Activity Logs
      this.get('/logs', (schema) => {
        return schema.all('log').models.map(m => m.attrs).reverse(); // Newest first
      });

      this.post('/logs', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('log', attrs).attrs;
      });
    },
  });
}
