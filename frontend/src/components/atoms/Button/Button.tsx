// src/components/atoms/Button/Button.tsx
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'full' | 'half' | 'quarter';
type TextSize = 'sm' | 'base' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  textSize?: TextSize;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'full',
  textSize = 'base', // 기본 텍스트 크기
  children,
  className,
  ...props
}) => {
  // 기본 스타일
  const baseStyle = 'h-12 rounded-md transition-all text-white';

  // 버라이언트별 스타일
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
  };

  // 사이즈별 너비 스타일
  const sizeStyles = {
    full: 'w-full',
    half: 'w-1/2',
    quarter: 'w-1/4',
  };

  // 텍스트 크기 스타일
  const textSizeStyles = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <button
      className={`
        ${baseStyle} 
        ${variantStyles[variant]} 
        ${sizeStyles[size]}
        ${textSizeStyles[textSize]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
