import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import ProductModal from '../components/ProductModal';
import { useLocalization } from '../hooks/useLocalization';
import type { Product } from '../types';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts }) => {
  const { translate } = useLocalization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const handleOpenModal = (product?: Product) => {
    setProductToEdit(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [product, ...prev];
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) return;

    const confirmationMessage = translate('confirm_delete_product', { productName: productToDelete.name });

    if (window.confirm(confirmationMessage)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title={translate('inventory')} />
      <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder={translate('search_products')}
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
            {translate('add_product')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">{translate('product_name')}</th>
                <th scope="col" className="px-6 py-3">{translate('category')}</th>
                <th scope="col" className="px-6 py-3">{translate('price')}</th>
                <th scope="col" className="px-6 py-3">{translate('quantity_in_stock')}</th>
                <th scope="col" className="px-6 py-3 text-center">{translate('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <img 
                        src={product.imageUrl || 'https://placehold.co/40x40/e0e0e0/777?text=?'} 
                        alt={product.name} 
                        className="w-10 h-10 rounded-md object-cover" 
                      />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.price.toFixed(2)} د.م.</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.stock <= product.lowStockThreshold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button onClick={() => handleOpenModal(product)} className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors" title={translate('edit')}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors" title={translate('delete')}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
      />
    </div>
  );
};

export default Inventory;
