import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  isRequired?: boolean;
}
