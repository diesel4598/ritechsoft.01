import type { Product, Sale, Customer, Supplier } from './types';

export const mockProducts: Product[] = [
  { id: 'P1672532400001', name: 'زيت زيتون', category: 'زيوت', price: 85, cost: 70, stock: 50, lowStockThreshold: 10, expiryDate: '2025-12-31', imageUrl: 'https://placehold.co/100x100/c7e8c2/6a8f61?text=زيت', description: 'زيت زيتون بكر ممتاز، عصرة أولى على البارد.' },
  { id: 'P1672532400002', name: 'معجون طماطم', category: 'معلبات', price: 5, cost: 3.5, stock: 120, lowStockThreshold: 20, expiryDate: '2024-10-01', imageUrl: 'https://placehold.co/100x100/f8c7c7/a36262?text=طماطم', description: 'معجون طماطم مركز، مثالي للصلصات.' },
  { id: 'P1672532400003', name: 'سكر', category: 'أساسيات', price: 10, cost: 8, stock: 200, lowStockThreshold: 50, imageUrl: 'https://placehold.co/100x100/f0f0f0/888?text=سكر', description: 'سكر أبيض نقي.' },
  { id: 'P1672532400004', name: 'شاي', category: 'مشروبات', price: 25, cost: 20, stock: 80, lowStockThreshold: 15, imageUrl: 'https://placehold.co/100x100/e0d8c7/8c7d61?text=شاي', description: 'شاي أسود فاخر.' },
  { id: 'P1672532400005', name: 'قهوة', category: 'مشروبات', price: 45, cost: 38, stock: 40, lowStockThreshold: 10, imageUrl: 'https://placehold.co/100x100/d4bca9/6b4f3a?text=قهوة', description: 'بن قهوة محمص.' },
  { id: 'P1672532400006', name: 'حليب', category: 'ألبان', price: 7.5, cost: 6, stock: 90, lowStockThreshold: 20, expiryDate: '2024-07-30', imageUrl: 'https://placehold.co/100x100/f5f5f5/555?text=حليب', description: 'حليب كامل الدسم.' },
];

export const mockCustomers: Customer[] = [
  { id: 'C1672532400001', name: 'أحمد علي', phone: '0501234567', address: '123 شارع الملك فهد، الرياض', debt: 150.75 },
  { id: 'C1672532400002', name: 'فاطمة محمد', phone: '0557654321', address: '456 طريق الأمير سلطان، جدة', debt: 0 },
  { id: 'C1672532400003', name: 'زبون نقدي', phone: 'N/A', address: 'N/A', debt: 0 },
];

export const mockSuppliers: Supplier[] = [
  { id: 'S1672532400001', name: 'شركة المواد الغذائية المتحدة', phone: '0112345678', address: 'المنطقة الصناعية، الرياض', balance: 5200 },
  { id: 'S1672532400002', name: 'مزارع الخير', phone: '0128765432', address: 'القصيم', balance: 0 },
];

export const mockSales: Sale[] = [
  { id: 'SA1672532400001', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), items: [{ productId: 'P1672532400001', productName: "زيت زيتون", quantity: 1, price: 85 }, { productId: 'P1672532400003', productName: "سكر", quantity: 2, price: 10 }], total: 105, profit: 20, customerId: 'C1672532400002', paymentMethod: 'card' },
  { id: 'SA1672532400002', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), items: [{ productId: 'P1672532400002', productName: "معجون طماطم", quantity: 5, price: 5 }], total: 25, profit: 7.5, customerId: 'C1672532400003', paymentMethod: 'cash' },
  { id: 'SA1672532400003', date: new Date().toISOString(), items: [{ productId: 'P1672532400004', productName: "شاي", quantity: 1, price: 25 }, { productId: 'P1672532400005', productName: "قهوة", quantity: 1, price: 45 }], total: 70, profit: 12, paymentMethod: 'cash' },
];

export const mockDailySales = [
  { name: 'السبت', sales: 4000 },
  { name: 'الأحد', sales: 3000 },
  { name: 'الإثنين', sales: 2000 },
  { name: 'الثلاثاء', sales: 2780 },
  { name: 'الأربعاء', sales: 1890 },
  { name: 'الخميس', sales: 2390 },
  { name: 'الجمعة', sales: 3490 },
];
