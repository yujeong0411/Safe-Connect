import { useState, useRef, useEffect } from 'react';
import { DropdownProps } from './Dropdown.types';

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  label,
  disabled = false,
}: DropdownProps) => {
  const [_inputValue, setInputValue] = useState(''); // 사용자 입력
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 다중 선택을 위한 배열 처리
  const selectedValues = value || [];
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
    const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
    onChange(newValues);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleRemoveOption = (optionValue: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    onChange(newValues);
  };

  const [focusedIndex, setFocusedIndex] = useState(-1); // 현재 포커스된 항목의 인덱스

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        setIsOpen(true);
        return;
      }
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;

      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[focusedIndex].value);
        } else if (searchTerm && filteredOptions.length > 0) {
          // 포커스된 항목이 없을 때는 첫 번째 항목 선택
          handleOptionClick(filteredOptions[0].value);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  // 포커스가 변경될 때마다 스크롤 조정
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusedIndex]);

  // 드롭다운이 닫힐 때 포커스 초기화
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

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
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true); // 텍스트 입력시 드롭다운 열기
          }}
          onKeyDown={handleKeyDown} // enter 처리
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={option.value}
                ref={(el) => (itemRefs.current[index] = el)} // ref 추가
                className={`px-4 py-2 cursor-pointer hover:bg-pink-50 ${
                  selectedValues.includes(option.value) ? 'bg-pink-100' : ''
                } ${index === focusedIndex ? 'bg-pink-50' : ''}`} // 포커스된 항목 스타일 추가
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
        <div className="mt-5">
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="bg-pink-100 px-2 py-1 rounded-md flex items-center text-base"
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
