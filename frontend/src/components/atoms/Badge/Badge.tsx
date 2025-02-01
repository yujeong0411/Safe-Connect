import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'status';
  status?: 'pending' | 'in-progress' | 'completed';
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ variant = 'primary', status, children, className = '' }: BadgeProps) => {
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    status: {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    },
  };

  const getStyle = () => {
    if (variant === 'status' && status) {
      return variantStyles.status[status];
    }
    return variantStyles[variant];
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${getStyle()} ${className}`}>
      {variant === 'status' && status ? (
        <>
          {status === 'pending' && '대기중'}
          {status === 'in-progress' && '진행중'}
          {status === 'completed' && '완료'}
        </>
      ) : (
        children
      )}
    </span>
  );
};

export default Badge;
