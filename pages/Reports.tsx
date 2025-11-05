import React, { useMemo } from 'react';
import Header from '../components/Header';
import { useLocalization } from '../hooks/useLocalization';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Product, Sale, Customer } from '../types';

interface ReportsProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
}

const Reports: React.FC<ReportsProps> = ({ sales, products }) => {
  const { translate } = useLocalization();

  const salesByDay = useMemo(() => {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const data: { [key: string]: { name: string; sales: number } } = {};
    days.forEach((day, index) => {
        data[index] = { name: day, sales: 0 };
    });

    sales.forEach(sale => {
      const dayIndex = new Date(sale.date).getDay();
      data[dayIndex].sales += sale.total;
    });

    return Object.values(data);
  }, [sales]);
  
  const topSellingProducts = useMemo(() => {
    const productSales: { [key: string]: { name: string, units_sold: number } } = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.productName, units_sold: 0 };
        }
        productSales[item.productId].units_sold += item.quantity;
      });
    });
    return Object.values(productSales).sort((a, b) => b.units_sold - a.units_sold).slice(0, 5);
  }, [sales]);

  const salesByCategory = useMemo(() => {
    const categorySales: { [key: string]: number } = {};
    sales.forEach(sale => {
        sale.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                if (!categorySales[product.category]) {
                    categorySales[product.category] = 0;
                }
                categorySales[product.category] += item.price * item.quantity;
            }
        });
    });
    return Object.entries(categorySales).map(([name, value]) => ({ name, value }));
  }, [sales, products]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title={translate('reports')} />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{translate('sales_over_time')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name={translate('total_sales')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{translate('top_selling_products')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="units_sold" fill="#82ca9d" name={translate('units_sold')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{translate('sales_by_category')}</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={salesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Reports;
