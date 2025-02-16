import React from 'react';

export interface SearchBarProps {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  buttonText?: string;
  onSearch?: (value: string) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  onButtonClick?: () => void;
  className?: string;
  formatValue?:(value: string) => string;
  isDisabled?: boolean;
}

export interface SearchBarRef {
  reset: () => void;
}