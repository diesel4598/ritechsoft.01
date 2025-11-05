import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import CustomerModal from '../components/CustomerModal';
import { useLocalization } from '../hooks/useLocalization';
import type { Customer } from '../types';

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const Customers: React.FC<CustomersProps> = ({ customers, setCustomers }) => {
  const { translate } = useLocalization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const handleOpenModal = (customer?: Customer) => {
    setCustomerToEdit(customer || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCustomerToEdit(null);
  };

  const handleSaveCustomer = (customer: Customer) => {
    setCustomers(prev => {
      const exists = prev.find(c => c.id === customer.id);
      if (exists) {
        return prev.map(c => c.id === customer.id ? customer : c);
      }
      return [customer, ...prev];
    });
  };

  const handleDeleteCustomer = (customerId: string) => {
    const customerToDelete = customers.find(c => c.id === customerId);
    if (!customerToDelete) return;
    
    const confirmationMessage = translate('confirm_delete_customer', { customerName: customerToDelete.name });
    
    if (window.confirm(confirmationMessage)) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title={translate('customers')} />
      <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder={translate('search_customers')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg pe-10"
            />
            <i className="fa-solid fa-search absolute end-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
          >
            <i className="fa-solid fa-plus me-2"></i>
            {translate('add_customer')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">{translate('customer_name')}</th>
                <th scope="col" className="px-6 py-3">{translate('phone')}</th>
                <th scope="col" className="px-6 py-3">{translate('address')}</th>
                <th scope="col" className="px-6 py-3">{translate('debt')}</th>
                <th scope="col" className="px-6 py-3 text-center">{translate('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">{customer.address}</td>
                  <td className="px-6 py-4">
                     <span className={`font-semibold ${customer.debt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {customer.debt.toFixed(2)} د.م.
                     </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button onClick={() => handleOpenModal(customer)} className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors" title={translate('edit')}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => handleDeleteCustomer(customer.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors" title={translate('delete')}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
        customerToEdit={customerToEdit}
      />
    </div>
  );
};

export default Customers;
