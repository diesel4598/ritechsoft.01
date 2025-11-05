import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Card from '../components/Card';
import { mockDailySales } from '../data/mockData';
import { useLocalization } from '../hooks/useLocalization';
import type { Product, Sale } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const { translate } = useLocalization();
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const expiredItems = products.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date()).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title={translate('dashboard')} />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title={translate('total_sales')} value={`${totalSales.toFixed(2)} د.م.`} iconClass="fa-solid fa-dollar-sign" colorClass="bg-green-500" />
        <Card title={translate('total_profit')} value={`${totalProfit.toFixed(2)} د.م.`} iconClass="fa-solid fa-chart-pie" colorClass="bg-blue-500" />
        <Card title={translate('low_stock_items')} value={lowStockItems} iconClass="fa-solid fa-triangle-exclamation" colorClass="bg-yellow-500" />
        <Card title={translate('expired_items')} value={expiredItems} iconClass="fa-solid fa-calendar-times" colorClass="bg-red-500" />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{translate('daily_sales_overview')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockDailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name={translate('total_sales')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
           <h3 className="text-lg font-bold text-gray-800 mb-4">{translate('recent_transactions')}</h3>
           <div className="space-y-4">
             {sales.slice(0, 5).map(sale => (
               <div key={sale.id} className="flex justify-between items-center border-b pb-2">
                 <div>
                   <p className="font-semibold text-gray-700">#{sale.id.slice(-6)}</p>
                   <p className="text-xs text-gray-500">{new Date(sale.date).toLocaleString()}</p>
                 </div>
                 <p className="font-bold text-green-600">{sale.total.toFixed(2)} د.م.</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;