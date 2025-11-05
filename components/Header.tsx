
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { Language } from '../types';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { language, setLanguage, translate } = useLocalization();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center">
        <label htmlFor="language-select" className="text-sm font-medium text-gray-600 me-2">
            {translate('language')}:
        </label>
        <select
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
        >
          <option value="ar">{translate('arabic')}</option>
          <option value="fr">{translate('french')}</option>
        </select>
      </div>
    </div>
  );
};

export default Header;
