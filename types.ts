export type Page = 'Dashboard' | 'Inventory' | 'POS' | 'Customers' | 'Suppliers' | 'Reports' | 'Settings';

export type Language = 'ar' | 'fr';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  barcode?: string;
  description?: string;
  expiryDate?: string;
  imageUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  profit: number;
  customerId?: string;
  paymentMethod: 'cash' | 'card';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  debt: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  balance: number; // Positive if we owe them, negative if they owe us
}
