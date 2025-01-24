import { forwardRef } from 'react';
import { InputProps } from './Input.types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      label,
      helperText,
      fullWidth = false,
      isRequired = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyle = 'rounded-md border outline-none focus:ring-2';

    const variantStyles = {
      default: 'border-gray-300 focus:border-pink-500 focus:ring-pink-200',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-200',
    };

    const sizeStyles = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const widthStyle = fullWidth ? 'w-full' : 'w-auto';

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-fit'}`}>
        {label && (
          <label className="block text-gray-700 text-sm font-medium mb-1">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
          ${baseStyle}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${widthStyle}
          ${className}
        `}
          {...props}
        />
        {helperText && (
          <p className={`mt-1 text-sm ${variant === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
