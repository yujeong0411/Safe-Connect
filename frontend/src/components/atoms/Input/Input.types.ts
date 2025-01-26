import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'white' | 'blue' | 'error';
  inputSize?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  width?: 'full' | 'half' | 'quarter' | 'auto';
  isRequired?: boolean;
  error?: string;
}
