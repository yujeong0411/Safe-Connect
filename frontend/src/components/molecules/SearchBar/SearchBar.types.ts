import React from 'react';

// 모든 속성을 선택적(optional)으로 가져온다.
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
}
