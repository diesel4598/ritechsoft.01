
import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  iconClass: string;
  colorClass: string;
}

const Card: React.FC<CardProps> = ({ title, value, iconClass, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center transition-transform hover:scale-105">
      <div className={`p-4 rounded-full ${colorClass} text-white text-2xl me-4`}>
        <i className={iconClass}></i>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

export default Card;
