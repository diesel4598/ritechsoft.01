import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { Sale, Customer } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
  customer: Customer | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, sale, customer }) => {
  const { translate } = useLocalization();

  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 m-4" dir="rtl">
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold">نظام المحل</h2>
          <p className="text-sm text-gray-500">{translate('receipt')}</p>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <p><strong>{translate('date')}:</strong> {new Date(sale.date).toLocaleString()}</p>
          <p><strong>{translate('receipt')} #:</strong> {sale.id.slice(-6).toUpperCase()}</p>
          <p><strong>{translate('sold_to')}:</strong> {customer?.name || translate('no_customer')}</p>
        </div>
        <div className="mt-4 border-t pt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right pb-2">{translate('item')}</th>
                <th className="text-center pb-2">{translate('quantity')}</th>
                <th className="text-left pb-2">{translate('price')}</th>
                <th className="text-left pb-2">{translate('subtotal')}</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.productName}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-left py-2">{item.price.toFixed(2)}</td>
                  <td className="text-left py-2">{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 border-t pt-4 text-right">
          <p className="text-lg font-bold">{translate('total')}: {sale.total.toFixed(2)} د.م.</p>
        </div>
        <div className="mt-6 text-center text-gray-600">
            <p>{translate('thank_you')}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{translate('close')}</button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{translate('print_receipt')}</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
