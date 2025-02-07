import { DispatchButtonProps } from './DispatchButton.types';

const DispatchButton = ({
  variant = 'blue',
  size = 'md',
  width = 'full',
  children,
  onClick,
  type,
  className = '',
  disabled = false,
}: DispatchButtonProps) => {
  const baseStyle = 'rounded-md transition-colors';

  const variantStyles = {
    blue: 'bg-[#545f71] hover:bg-[#697383] text-white',
    gray: 'bg-[#DDDDDD] hover:bg-[#ABABAB] text-gray-800',
    red: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl',
  };

  const widthStyles = {
    full: 'w-full',
    half: 'w-1/2',
    quarter: 'w-1/4',
    sm: 'w-1/6',
    auto: 'w-auto',
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles[width]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default DispatchButton;