import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import ReceiptModal from '../components/ReceiptModal';
import { useLocalization } from '../hooks/useLocalization';
import type { Product, Customer, Sale, CartItem } from '../types';

interface POSProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}

const POS: React.FC<POSProps> = ({ products, setProducts, customers, setCustomers, sales, setSales }) => {
  const { translate } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm))
    ).slice(0, 10); // Limit results for performance
  }, [products, searchTerm]);
  
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Check stock limit
        if (existingItem.quantity >= product.stock) return prevCart;
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      if (product.stock > 0) {
        return [...prevCart, { ...product, quantity: 1 }];
      }
      return prevCart;
    });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const productInStock = products.find(p => p.id === productId);
      if (!productInStock) return prevCart;

      if (quantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }
      // Ensure we don't exceed stock
      const newQuantity = Math.min(quantity, productInStock.stock);
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };
  
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const saleItems = cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
    }));
    
    const totalProfit = cart.reduce((profit, item) => {
        const productCost = products.find(p => p.id === item.id)?.cost || 0;
        return profit + (item.price - productCost) * item.quantity;
    }, 0);

    const newSale: Sale = {
      id: `SA${Date.now()}`,
      date: new Date().toISOString(),
      items: saleItems,
      total: cartTotal,
      profit: totalProfit,
      customerId: selectedCustomerId,
      paymentMethod: paymentMethod,
    };
    
    // Update product stock
    setProducts(prevProducts =>
        prevProducts.map(p => {
            const itemInCart = cart.find(item => item.id === p.id);
            if (itemInCart) {
                return { ...p, stock: p.stock - itemInCart.quantity };
            }
            return p;
        })
    );

    // Add sale to history
    setSales(prevSales => [newSale, ...prevSales]);
    setLastSale(newSale);
    
    // Clear cart and search
    setCart([]);
    setSearchTerm('');
    setSelectedCustomerId(undefined);
    setIsReceiptModalOpen(true);
  };
  
  const handleNewSale = () => {
    setIsReceiptModalOpen(false);
    setLastSale(null);
  };

  if (isReceiptModalOpen) {
      return (
          <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
              <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                  <i className="fa-solid fa-check-circle text-5xl text-green-500 mb-4"></i>
                  <h2 className="text-2xl font-bold mb-4">{translate('sale_successful')}</h2>
                  <div className="space-x-2 space-x-reverse">
                      <button onClick={handleNewSale} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{translate('new_sale')}</button>
                      <button onClick={() => setIsReceiptModalOpen(true)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{translate('print_receipt')}</button>
                  </div>
              </div>
              <ReceiptModal
                isOpen={isReceiptModalOpen}
                onClose={handleNewSale}
                sale={lastSale}
                customer={customers.find(c => c.id === lastSale?.customerId) || null}
              />
          </div>
      )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title={translate('pos')} />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Product Search & Selection */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={translate('search_by_name_or_barcode')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg pe-12 text-lg"
            />
            <i className="fa-solid fa-search absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[65vh] overflow-y-auto">
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => addToCart(product)} className="border rounded-lg p-3 text-center cursor-pointer hover:shadow-lg hover:border-primary-500 transition-shadow">
                <img src={product.imageUrl || 'https://placehold.co/100x100/e0e0e0/777?text=?'} alt={product.name} className="w-24 h-24 object-cover mx-auto rounded-md mb-2" />
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-primary-600 font-bold">{product.price.toFixed(2)} د.م.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">{translate('cart')}</h3>
          <div className="flex-grow overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-10">{translate('empty_cart')}</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price.toFixed(2)} د.م.</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="w-16 text-center border rounded-md p-1 mx-2"
                      min="0"
                      max={item.stock}
                    />
                    <p className="font-bold w-20 text-end">{(item.price * item.quantity).toFixed(2)} د.م.</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t pt-4 mt-4 space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">{translate('customer')}</label>
                <select 
                    value={selectedCustomerId || ''} 
                    onChange={e => setSelectedCustomerId(e.target.value || undefined)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="">{translate('no_customer')}</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">{translate('payment_method')}</label>
                 <div className="mt-2 flex space-x-4 space-x-reverse">
                    <button onClick={() => setPaymentMethod('cash')} className={`px-4 py-2 rounded-lg flex-1 ${paymentMethod === 'cash' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>{translate('cash')}</button>
                    <button onClick={() => setPaymentMethod('card')} className={`px-4 py-2 rounded-lg flex-1 ${paymentMethod === 'card' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>{translate('card')}</button>
                 </div>
             </div>
            <div className="text-2xl font-bold flex justify-between">
              <span>{translate('total')}:</span>
              <span>{cartTotal.toFixed(2)} د.م.</span>
            </div>
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="w-full py-3 bg-green-600 text-white rounded-lg text-lg font-bold hover:bg-green-700 disabled:bg-gray-400"
            >
              {translate('complete_sale')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
