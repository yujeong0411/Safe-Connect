import { forwardRef } from 'react';
import { InputProps } from './Input.types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      variant = 'white',
      inputSize = 'md',
      label,
      helperText,
      width = 'full',
      isRequired = false,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyle = 'rounded-md border outline-none focus:ring-2';

    const variantStyles = {
      white: 'bg-[#FFFFFF] focus:ring-blue-200',
      blue: 'bg-[#EBEDF3] focus:ring-blue-200',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-200',
    };

    const inputSizeStyles = {
      sm: 'px-2 py-2 text-sm',
      md: 'px-3 py-3 text-base',
      lg: 'px-4 py-4 text-lg',
    };

    const widthStyles = {
      full: 'w-full', // 100%
      half: 'w-full md:w-1/2', // 50%
      quarter: 'w-full sm:w-1/2 md:w-1/4', // 25%
      auto: 'w-auto', // 자동
    };

    return (
      <div className={`${width ? 'w-full' : 'w-fit'}`}>
        {label && (
          <label className="block text-gray-700 text-sm font-medium mb-1">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
          ${error ? variantStyles.error : variantStyles[variant]}
          ${baseStyle}
          ${variantStyles[variant]}
          ${inputSizeStyles[inputSize]}
          ${widthStyles[width]}
          ${disabled ? 'bg-gray-100 cursor-not-allowed pointer-events-none' : ''}  // 추가
          ${className}
        `}
          {...props}
        />
        {error && typeof props.value === 'string' && props.value.trim() !== '' && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
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
