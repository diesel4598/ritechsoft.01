import React from 'react';
import Header from '../components/Header';
import { useLocalization } from '../hooks/useLocalization';

interface SettingsProps {
    onResetData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onResetData }) => {
    const { translate } = useLocalization();

    const handleResetClick = () => {
        if (window.confirm(translate('reset_data_confirm'))) {
            onResetData();
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Header title={translate('settings')} />
            <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{translate('app_settings')}</h2>
                <div className="border-t pt-4">
                    <p className="text-gray-600 mb-2">
                        {translate('reset_data_confirm')}
                    </p>
                    <button 
                        onClick={handleResetClick}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                    >
                        <i className="fa-solid fa-triangle-exclamation me-2"></i>
                        {translate('reset_data')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;