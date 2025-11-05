import React, { useState, useEffect } from 'react';
import { generateProductDescription } from '../services/geminiService';
import { useLocalization } from '../hooks/useLocalization';
import type { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
  categories: string[];
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, productToEdit, categories }) => {
  const { translate } = useLocalization();
  const [product, setProduct] = useState<Partial<Product>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
      if (categories.includes(productToEdit.category)) {
          setIsAddingNewCategory(false);
      } else {
          setIsAddingNewCategory(true);
          setNewCategory(productToEdit.category);
      }
    } else {
      setProduct({
        id: `P${Date.now()}`,
        name: '',
        category: categories.length > 0 ? categories[0] : '',
        price: 0,
        cost: 0,
        stock: 0,
        lowStockThreshold: 10,
        barcode: '',
        description: '',
        expiryDate: '',
        imageUrl: '',
      });
      setIsAddingNewCategory(false);
      setNewCategory('');
    }
  }, [productToEdit, isOpen, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === '__NEW__') {
      setIsAddingNewCategory(true);
      setProduct(prev => ({ ...prev, category: '' }));
    } else {
      setIsAddingNewCategory(false);
      setNewCategory('');
      setProduct(prev => ({ ...prev, category: value }));
    }
  };

  const handleGenerateDescription = async () => {
    if (!product.name) return;
    setIsGenerating(true);
    const description = await generateProductDescription(product.name);
    setProduct(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleSave = () => {
    const finalProduct = {
      ...product,
      category: isAddingNewCategory ? newCategory.trim() : product.category,
    };
    
    if (finalProduct.name && finalProduct.category && (finalProduct.price || 0) > 0 && (finalProduct.stock || 0) >= 0) {
      onSave(finalProduct as Product);
      onClose();
    } else {
      alert("Please fill all required fields, including the new category name if applicable.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 m-4" dir={document.documentElement.dir}>
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {productToEdit ? translate('edit_product') : translate('new_product')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{translate('product_name')}</label>
              <input type="text" name="name" value={product.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{translate('category')}</label>
              <select
                  name="category"
                  value={isAddingNewCategory ? '__NEW__' : product.category || ''}
                  onChange={handleCategoryChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
              >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="__NEW__">{translate('add_new_category')}</option>
              </select>
              {isAddingNewCategory && (
                  <input
                      type="text"
                      placeholder={translate('category')}
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                  />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{translate('price')}</label>
              <input type="number" name="price" value={product.price || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{translate('product_cost')}</label>
              <input type="number" name="cost" value={product.cost || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{translate('quantity_in_stock')}</label>
              <input type="number" name="stock" value={product.stock || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{translate('low_stock_threshold')}</label>
              <input type="number" name="lowStockThreshold" value={product.lowStockThreshold || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">{translate('expiry_date')}</label>
              <input type="date" name="expiryDate" value={product.expiryDate || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('barcode_optional')}</label>
            <input type="text" name="barcode" value={product.barcode || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('product_image_url')}</label>
            <input type="text" name="imageUrl" value={product.imageUrl || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translate('description_optional')}</label>
            <textarea name="description" value={product.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
            <button
              onClick={handleGenerateDescription}
              disabled={isGenerating || !product.name}
              className="mt-2 text-sm px-3 py-1 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center"
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin me-2"></i>
                  {translate('generating')}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                  {translate('generate_with_ai')}
                </>
              )}
            </button>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{translate('cancel')}</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{translate('save_product')}</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;