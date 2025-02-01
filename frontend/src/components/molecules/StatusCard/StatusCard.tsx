// src/components/molecules/StatsCard/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  variant?: 'blue' | 'red' | 'gray';
  className?: string;
}

const StatsCard = ({ title, value, variant = 'blue', className = '' }: StatsCardProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-50 text-blue-600';
      case 'red':
        return 'bg-red-50 text-red-600';
      case 'gray':
        return 'bg-gray-50 text-gray-600';
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div className={`p-4 rounded-lg ${getVariantStyle()} ${className}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;
