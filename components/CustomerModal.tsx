import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { Customer } from '../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  customerToEdit?: Customer | null;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSave, customerToEdit }) => {
  const { translate } = useLocalization();
  const [customer, setCustomer] = useState<Partial<Customer>>({});

  useEffect(() => {
    if (customerToEdit) {
      setCustomer(customerToEdit);
    } else {
      setCustomer({
        id: `C${Date.now()}`,
        name: '',
        phone: '',
        address: '',
        debt: 0,
      });
    }
  }, [customerToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setCustomer(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSave = () => {
    if (customer.name && customer.phone) {
      onSave(customer as Customer);
      onClose();
    } else {
      alert("Please fill in the customer's name and phone number.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 m-4" dir={document.documentElement.dir}>
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {customerToEdit ? translate('edit_customer') : translate('new_customer')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto p-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('customer_name')}</label>
            <input type="text" name="name" value={customer.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('phone')}</label>
            <input type="tel" name="phone" value={customer.phone || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('address')}</label>
            <input type="text" name="address" value={customer.address || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('debt')}</label>
            <input type="number" name="debt" value={customer.debt || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{translate('cancel')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{translate('save_customer')}</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
