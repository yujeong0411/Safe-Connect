import React from 'react';

interface BadgeProps {
  status: 'pending' | 'in-progress' | 'completed';
  className?: string;
}

const Badge = ({ status, className = '' }: BadgeProps) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${statusStyles[status]} ${className}`}>
      {status === 'pending' && '대기중'}
      {status === 'in-progress' && '진행중'}
      {status === 'completed' && '완료'}
    </span>
  );
};

export default Badge;