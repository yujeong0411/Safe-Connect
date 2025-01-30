// Dropdown.types.ts
export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: number | number[]; // 단일/다중 선택 모두 지원
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isMulti?: boolean;
}
