import { Product, Order } from './types';

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
    items: []
  },
  {
    id: 'ORD-002',
    customerName: 'Siti Aminah',
    customerPhone: '08198765432',
    date: '2024-03-09',
    total: 15500000,
    status: 'Completed',
    items: []
  },
  {
    id: 'ORD-003',
    customerName: 'Andi Wijaya',
    customerPhone: '08134567890',
    date: '2024-03-08',
    total: 9499000,
    status: 'Shipped',
    items: []
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
