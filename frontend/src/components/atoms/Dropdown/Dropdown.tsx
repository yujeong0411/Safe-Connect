// Dropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { DropdownProps } from './Dropdown.types';

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  label,
  disabled = false,
  size = 'md',
  isMulti = true, // 다중 선택 여부
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sizeStyles = {
    sm: 'px-10 py-2 text-sm',
    md: 'px-30 py-3',
    lg: 'px-30 py-3 text-lg',
  };

  // 다중 선택을 위한 배열 처리
  const selectedValues = Array.isArray(value) ? value : [value].filter(Boolean);
  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));

  // 검색어에 따른 필터링
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: number) => {
    if (isMulti) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
      setIsOpen(false);
      setSearchTerm(''); // 선택 후 검색어 초기화
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm(''); // 선택 후 검색어 초기화
    }
  };

  const handleRemoveOption = (optionValue: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    onChange(isMulti ? newValues : null);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

      <div
        className={`w-full px-4 py-2 bg-white border rounded-md ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-pink-500'
        } ${isOpen ? 'border-pink-500' : ''}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 0);
          }
        }}
      >
        <input
          ref={searchInputRef}
          type="text"
          className="w-full focus:outline-none"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true); // 검색어 입력 시 자동으로 드롭다운 열기
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-pink-50 ${
                  selectedValues.includes(option.value) ? 'bg-pink-100' : ''
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-gray-500">검색 결과가 없습니다</div>
            )}
          </div>
        </div>
      )}

      {/* 선택된 항목들을 하단에 표시 */}
      {selectedOptions.length > 0 && (
        <div className="mt-2">
          <div className="text-sm text-gray-600 mb-1">선택된 항목:</div>
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="bg-pink-100 px-2 py-1 rounded-md flex items-center text-sm"
              >
                {option.label}
                <button
                  className="ml-2 text-pink-500 hover:text-pink-700"
                  onClick={(e) => handleRemoveOption(option.value, e)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Dropdown;
