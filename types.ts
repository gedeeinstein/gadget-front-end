export type Brand = 'Apple' | 'Samsung' | 'Xiaomi' | 'Oppo' | 'Vivo';
export type Category = 'Phone' | 'Tablet' | 'Watch' | 'Accessory';
export type Condition = 'New Official' | 'New Inter' | 'Second Ex-Box' | 'Second Batangan';

export interface PriceTier {
  condition: Condition;
  price: number;
  promoPrice?: number;
  stock: 'ready' | 'low' | 'empty';
}

export interface ProductVariant {
  id: string;
  storage: string;
  color: string;
  ram?: string;
  sku: string;
  prices: PriceTier[]; // Prices for this specific variant based on condition
  image?: string; // Specific image for this color
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: Brand;
  category: Category;
  description: string;
  specs: Record<string, string>;
  baseImage: string;
  variants: ProductVariant[];
  isFeatured?: boolean;
  releaseYear: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  condition: Condition;
  name: string;
  image: string;
  specSummary: string; // e.g., "256GB - Blue Titanium"
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: CartItem[];
}

export type Role = 'Admin' | 'Editor' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}
