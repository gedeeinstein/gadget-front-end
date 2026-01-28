import { Product, Order, User, ActivityLog, OrderStatus } from '../types';

const API_BASE_URL = '/api';

// Helper to get token (mock implementation)
const getToken = () => localStorage.getItem('auth_token');

interface FetchOptions extends RequestInit {
  data?: any;
}

// Generic Fetch Wrapper
async function fetchClient<T>(endpoint: string, { data, ...customConfig }: FetchOptions = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 204) {
        return {} as T;
    }

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(responseData?.message || `API request failed with status ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  // Auth
  auth: {
    login: (credentials: any) => fetchClient<{ user: User, token: string }>('/login', { data: credentials }),
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    }
  },

  // Products
  products: {
    getAll: () => fetchClient<Product[]>('/products'),
    getById: (id: string) => fetchClient<Product>(`/products/${id}`),
    create: (product: Product) => fetchClient<Product>('/products', { data: product }),
    update: (id: string, product: Partial<Product>) => fetchClient<Product>(`/products/${id}`, { method: 'PUT', data: product }),
    delete: (id: string) => fetchClient<void>(`/products/${id}`, { method: 'DELETE' }),
  },

  // Orders
  orders: {
    getAll: () => fetchClient<Order[]>('/orders'),
    create: (order: Order) => fetchClient<Order>('/orders', { data: order }),
    update: (id: string, updates: Partial<Order>) => fetchClient<Order>(`/orders/${id}`, { method: 'PUT', data: updates }),
    updateStatus: (id: string, status: OrderStatus) => fetchClient<Order>(`/orders/${id}`, { method: 'PUT', data: { status } }),
    delete: (id: string) => fetchClient<void>(`/orders/${id}`, { method: 'DELETE' }),
  },

  // Users
  users: {
    getAll: () => fetchClient<User[]>('/users'),
    create: (user: User) => fetchClient<User>('/users', { data: user }),
    update: (id: string, updates: Partial<User>) => fetchClient<User>(`/users/${id}`, { method: 'PUT', data: updates }),
    delete: (id: string) => fetchClient<void>(`/users/${id}`, { method: 'DELETE' }),
  },

  // Logs
  logs: {
    getAll: () => fetchClient<ActivityLog[]>('/logs'),
    create: (log: ActivityLog) => fetchClient<ActivityLog>('/logs', { data: log }),
  }
};
