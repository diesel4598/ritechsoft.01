import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { LocalizationProvider } from './context/LocalizationContext';
import { mockProducts, mockSales, mockCustomers, mockSuppliers } from './data/mockData';
import { useStickyState } from './hooks/useStickyState';
import type { Page, Product, Sale, Customer, Supplier } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Dashboard');

  // State is now persistent across reloads using localStorage.
  const [products, setProducts] = useStickyState<Product[]>(mockProducts, 'products');
  const [customers, setCustomers] = useStickyState<Customer[]>(mockCustomers, 'customers');
  const [suppliers, setSuppliers] = useStickyState<Supplier[]>(mockSuppliers, 'suppliers');
  const [sales, setSales] = useStickyState<Sale[]>(mockSales, 'sales');
  
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all application data? This cannot be undone.')) {
        localStorage.removeItem('products');
        localStorage.removeItem('customers');
        localStorage.removeItem('suppliers');
        localStorage.removeItem('sales');
        window.location.reload();
    }
  };


  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard products={products} sales={sales} />;
      case 'Inventory':
        return <Inventory products={products} setProducts={setProducts} />;
      case 'POS':
        return <POS 
            products={products} 
            setProducts={setProducts}
            customers={customers}
            setCustomers={setCustomers}
            sales={sales}
            setSales={setSales}
        />;
      case 'Customers':
        return <Customers customers={customers} setCustomers={setCustomers} />;
      case 'Suppliers':
        return <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} />;
      case 'Reports':
        return <Reports sales={sales} products={products} customers={customers} />;
      case 'Settings':
        return <Settings onResetData={handleResetData} />;
      default:
        return <Dashboard products={products} sales={sales} />;
    }
  };

  return (
    <LocalizationProvider>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </LocalizationProvider>
  );
};

export default App;