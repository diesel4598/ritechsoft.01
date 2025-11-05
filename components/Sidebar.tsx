
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  iconClass: string;
  label: string;
  page: Page;
  activePage: Page;
  onClick: (page: Page) => void;
}> = ({ iconClass, label, page, activePage, onClick }) => (
  <li
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
      activePage === page
        ? 'bg-primary-600 text-white shadow-lg'
        : 'text-gray-300 hover:bg-primary-800 hover:text-white'
    }`}
    onClick={() => onClick(page)}
  >
    <i className={`${iconClass} w-6 text-center text-lg`}></i>
    <span className="mx-4 font-medium">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { translate } = useLocalization();

  const navItems: { page: Page; icon: string; key: string }[] = [
    { page: 'Dashboard', icon: 'fa-solid fa-tachometer-alt', key: 'dashboard' },
    { page: 'Inventory', icon: 'fa-solid fa-boxes-stacked', key: 'inventory' },
    { page: 'POS', icon: 'fa-solid fa-cash-register', key: 'pos' },
    { page: 'Customers', icon: 'fa-solid fa-users', key: 'customers' },
    { page: 'Suppliers', icon: 'fa-solid fa-truck-fast', key: 'suppliers' },
    { page: 'Reports', icon: 'fa-solid fa-chart-line', key: 'reports' },
    { page: 'Settings', icon: 'fa-solid fa-cog', key: 'settings' },
  ];

  return (
    <aside className="w-64 bg-primary-900 text-white flex flex-col p-4 shadow-2xl">
      <div className="text-center py-4 border-b border-primary-800">
        <h1 className="text-2xl font-bold">
          <i className="fa-solid fa-store me-2"></i>
          نظام المحل
        </h1>
      </div>
      <nav className="flex-1 mt-6">
        <ul>
          {navItems.map((item) => (
            <NavItem
              key={item.page}
              iconClass={item.icon}
              label={translate(item.key)}
              page={item.page}
              activePage={activePage}
              onClick={setActivePage}
            />
          ))}
        </ul>
      </nav>
      <div className="py-2 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} - V 1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;
