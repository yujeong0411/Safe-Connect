// Dropdown.types.ts
export interface DropdownOption {
  value: number;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: number[] // 항상 다중선택 허용
  onChange: (value: number[] ) => void;
  placeholder?: string;
  label?: string
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onAddOption?: (value: DropdownOption) => void;
}