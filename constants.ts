import { Product, Order, User } from './types';

export const STORE_PHONE = "6281234567890";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    brand: 'Apple',
    category: 'Phone',
    releaseYear: 2023,
    description: 'The first iPhone to feature an aerospace-grade titanium design, using the same alloy that spacecraft use for missions to Mars.',
    warranty: '1 Year Official iBox',
    specs: {
      'Chip': 'A17 Pro chip',
      'Display': '6.1-inch Super Retina XDR',
      'Camera': '48MP Main | Ultra Wide | Telephoto',
      'Battery': 'Up to 23 hours video playback'
    },
    baseImage: 'https://picsum.photos/id/88/600/600',
    isFeatured: true,
    variants: [
      {
        id: 'v1-128-nat',
        storage: '128GB',
        color: 'Natural Titanium',
        sku: 'IP15P-128-NAT',
        prices: [
          { condition: 'New Official', price: 18999000, promoPrice: 18499000, stock: 'ready' },
          { condition: 'Second Ex-Box', price: 15500000, stock: 'low' }
        ]
      },
      {
        id: 'v1-256-blue',
        storage: '256GB',
        color: 'Blue Titanium',
        sku: 'IP15P-256-BLU',
        prices: [
          { condition: 'New Official', price: 21999000, stock: 'ready' },
          { condition: 'New Inter', price: 19500000, stock: 'ready' }
        ]
      }
    ]
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-s24-ultra',
    brand: 'Samsung',
    category: 'Phone',
    releaseYear: 2024,
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity.',
    warranty: '1 Year SEIN Indonesia',
    specs: {
      'Chip': 'Snapdragon 8 Gen 3',
      'Display': '6.8-inch QHD+ Dynamic AMOLED 2X',
      'Camera': '200MP Wide',
      'Battery': '5000 mAh'
    },
    baseImage: 'https://picsum.photos/id/24/600/600',
    isFeatured: true,
    variants: [
      {
        id: 'v2-256-grey',
        storage: '256GB',
        color: 'Titanium Grey',
        ram: '12GB',
        sku: 'S24U-256-GRY',
        prices: [
          { condition: 'New Official', price: 19999000, stock: 'ready' },
          { condition: 'Second Ex-Box', price: 16200000, stock: 'ready' }
        ]
      },
      {
        id: 'v2-512-black',
        storage: '512GB',
        color: 'Titanium Black',
        ram: '12GB',
        sku: 'S24U-512-BLK',
        prices: [
          { condition: 'New Official', price: 21999000, promoPrice: 20999000, stock: 'low' }
        ]
      }
    ]
  },
  {
    id: 'p3',
    name: 'iPad Air 5',
    slug: 'ipad-air-5',
    brand: 'Apple',
    category: 'Tablet',
    releaseYear: 2022,
    description: 'Light. Bright. Full of might. Supercharged by the Apple M1 chip.',
    warranty: '1 Year International',
    specs: {
      'Chip': 'M1 chip',
      'Display': '10.9-inch Liquid Retina',
      'Camera': '12MP Wide',
      'Connector': 'USB-C'
    },
    baseImage: 'https://picsum.photos/id/119/600/600',
    isFeatured: false,
    variants: [
      {
        id: 'v3-64-blue',
        storage: '64GB',
        color: 'Blue',
        sku: 'IPA5-64-BLU',
        prices: [
          { condition: 'New Official', price: 9499000, stock: 'ready' },
          { condition: 'Second Ex-Box', price: 7200000, stock: 'ready' }
        ]
      }
    ]
  },
  {
    id: 'p4',
    name: 'Xiaomi 14',
    slug: 'xiaomi-14',
    brand: 'Xiaomi',
    category: 'Phone',
    releaseYear: 2024,
    description: 'Co-engineered with Leica. A new chapter in mobile photography.',
    warranty: '15 Months Official Xiaomi',
    specs: {
      'Chip': 'Snapdragon 8 Gen 3',
      'Display': '6.36" AMOLED',
      'Camera': 'Leica Summilux lens',
      'Battery': '4610mAh'
    },
    baseImage: 'https://picsum.photos/id/201/600/600',
    isFeatured: true,
    variants: [
      {
        id: 'v4-256-black',
        storage: '256GB',
        color: 'Black',
        ram: '12GB',
        sku: 'MI14-256-BLK',
        prices: [
          { condition: 'New Official', price: 11999000, stock: 'ready' }
        ]
      }
    ]
  }
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Budi Santoso',
    customerPhone: '08123456789',
    date: '2024-03-10',
    total: 21999000,
    status: 'Pending',
    items: [
      {
        productId: 'p2',
        variantId: 'v2-512-black',
        condition: 'New Official',
        name: 'Samsung Galaxy S24 Ultra',
        image: 'https://picsum.photos/id/24/600/600',
        specSummary: '512GB - Titanium Black',
        price: 21999000,
        quantity: 1
      }
    ],
    notes: '',
    timeline: [
      { id: 't1', status: 'Pending', date: '2024-03-10T10:30:00Z', user: 'System', note: 'Order placed by customer' }
    ]
  },
  {
    id: 'ORD-002',
    customerName: 'Siti Aminah',
    customerPhone: '08198765432',
    date: '2024-03-09',
    total: 15500000,
    status: 'Completed',
    items: [
      {
        productId: 'p1',
        variantId: 'v1-128-nat',
        condition: 'Second Ex-Box',
        name: 'iPhone 15 Pro',
        image: 'https://picsum.photos/id/88/600/600',
        specSummary: '128GB - Natural Titanium',
        price: 15500000,
        quantity: 1
      }
    ],
    notes: 'Customer requested express delivery.',
    timeline: [
      { id: 't5', status: 'Completed', date: '2024-03-10T11:00:00Z', user: 'System', note: 'Order received by customer' },
      { id: 't4', status: 'Shipped', date: '2024-03-09T14:00:00Z', user: 'Admin', note: 'Package handed to courier' },
      { id: 't3', status: 'Processing', date: '2024-03-09T10:00:00Z', user: 'Admin', note: 'Payment verified' },
      { id: 't2', status: 'Pending', date: '2024-03-09T09:00:00Z', user: 'System', note: 'Order placed' }
    ]
  },
  {
    id: 'ORD-003',
    customerName: 'Andi Wijaya',
    customerPhone: '08134567890',
    date: '2024-03-08',
    total: 9499000,
    status: 'Shipped',
    items: [
      {
        productId: 'p3',
        variantId: 'v3-64-blue',
        condition: 'New Official',
        name: 'iPad Air 5',
        image: 'https://picsum.photos/id/119/600/600',
        specSummary: '64GB - Blue',
        price: 9499000,
        quantity: 1
      }
    ],
    notes: '',
    timeline: [
      { id: 't8', status: 'Shipped', date: '2024-03-09T09:00:00Z', user: 'Admin' },
      { id: 't7', status: 'Processing', date: '2024-03-08T16:00:00Z', user: 'Admin' },
      { id: 't6', status: 'Pending', date: '2024-03-08T15:30:00Z', user: 'System', note: 'Order placed' }
    ]
  }
];

export const SAMPLE_USERS: User[] = [
  {
    id: 'u1',
    name: 'Super Admin',
    email: 'admin@anyelir.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-03-10 09:30'
  },
  {
    id: 'u2',
    name: 'Sales Staff',
    email: 'sales@anyelir.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2024-03-10 08:15'
  },
  {
    id: 'u3',
    name: 'Inventory Viewer',
    email: 'inventory@anyelir.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '2024-03-01 14:00'
  }
];

export const formatRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
