// src/components/atoms/StatusBadge/StatusBadge.tsx
import React from 'react';

interface StatusBadgeProps {
  status: 'waiting' | 'in_progress' | 'completed';
  className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'waiting':
        return 'bg-red-100 text-red-600';
      case 'in_progress':
        return 'bg-blue-100 text-blue-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'waiting':
        return '대기중';
      case 'in_progress':
        return '출동중';
      case 'completed':
        return '완료';
      default:
        return '';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle()} ${className}`}>
      {getStatusText()}
    </span>
  );
};

export default StatusBadge;