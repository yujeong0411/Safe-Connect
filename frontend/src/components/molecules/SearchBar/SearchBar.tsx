import React, { useState } from 'react';
import Input from '@components/atoms/Input/Input.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import { SearchBarProps } from '@components/molecules/SearchBar/SearchBar.types.ts';

const SearchBar = ({
  label,
  isRequired = false,
  placeholder = '검색어를 입력하세요',
  buttonText = '검색',
  onSearch = () => {},
  onButtonClick,
  onChange,
  error,
  value: controlledValue,
}: SearchBarProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<string>('');

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (onChange) {
      onChange(e);
    } else {
      setUncontrolledValue(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(value);
  };
  return (
    <form onSubmit={handleSubmit} className="relative w-full  min-w-[300px]">
      <Input
        label={label}
        isRequired={isRequired}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pr-24" // 버튼 공간 확보
        error={error}
      />
      <button
        type="submit"
        className="absolute right-2 top-[32px] px-4 py-1 bg-banner text-white rounded-md hover:bg-[#697383] transition-colors"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default SearchBar;
