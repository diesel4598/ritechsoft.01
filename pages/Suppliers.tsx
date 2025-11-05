import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import SupplierModal from '../components/SupplierModal';
import { useLocalization } from '../hooks/useLocalization';
import type { Supplier } from '../types';

interface SuppliersProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, setSuppliers }) => {
  const { translate } = useLocalization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm)
    );
  }, [suppliers, searchTerm]);

  const handleOpenModal = (supplier?: Supplier) => {
    setSupplierToEdit(supplier || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSupplierToEdit(null);
  };

  const handleSaveSupplier = (supplier: Supplier) => {
    setSuppliers(prev => {
      const exists = prev.find(s => s.id === supplier.id);
      if (exists) {
        return prev.map(s => s.id === supplier.id ? supplier : s);
      }
      return [supplier, ...prev];
    });
  };

  const handleDeleteSupplier = (supplierId: string) => {
    const supplierToDelete = suppliers.find(s => s.id === supplierId);
    if (!supplierToDelete) return;

    const confirmationMessage = translate('confirm_delete_supplier', { supplierName: supplierToDelete.name });
    
    if (window.confirm(confirmationMessage)) {
      setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title={translate('suppliers')} />
      <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder={translate('search_suppliers')}
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
            {translate('add_supplier')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">{translate('supplier_name')}</th>
                <th scope="col" className="px-6 py-3">{translate('phone')}</th>
                <th scope="col" className="px-6 py-3">{translate('address')}</th>
                <th scope="col" className="px-6 py-3">{translate('balance')}</th>
                <th scope="col" className="px-6 py-3 text-center">{translate('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(supplier => (
                <tr key={supplier.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4">{supplier.phone}</td>
                  <td className="px-6 py-4">{supplier.address}</td>
                  <td className="px-6 py-4">
                     <span className={`font-semibold ${supplier.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {supplier.balance.toFixed(2)} د.م.
                     </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button onClick={() => handleOpenModal(supplier)} className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors" title={translate('edit')}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => handleDeleteSupplier(supplier.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors" title={translate('delete')}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SupplierModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSupplier}
        supplierToEdit={supplierToEdit}
      />
    </div>
  );
};

export default Suppliers;
