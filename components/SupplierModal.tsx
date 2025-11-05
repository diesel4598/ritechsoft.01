import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { Supplier } from '../types';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  supplierToEdit?: Supplier | null;
}

const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, onSave, supplierToEdit }) => {
  const { translate } = useLocalization();
  const [supplier, setSupplier] = useState<Partial<Supplier>>({});

  useEffect(() => {
    if (supplierToEdit) {
      setSupplier(supplierToEdit);
    } else {
      setSupplier({
        id: `S${Date.now()}`,
        name: '',
        phone: '',
        address: '',
        balance: 0,
      });
    }
  }, [supplierToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSupplier(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSave = () => {
    if (supplier.name && supplier.phone) {
      onSave(supplier as Supplier);
      onClose();
    } else {
      alert("Please fill in the supplier's name and phone number.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 m-4" dir={document.documentElement.dir}>
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {supplierToEdit ? translate('edit_supplier') : translate('new_supplier')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto p-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('supplier_name')}</label>
            <input type="text" name="name" value={supplier.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('phone')}</label>
            <input type="tel" name="phone" value={supplier.phone || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('address')}</label>
            <input type="text" name="address" value={supplier.address || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('balance')}</label>
            <input type="number" name="balance" value={supplier.balance || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{translate('cancel')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{translate('save_supplier')}</button>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;