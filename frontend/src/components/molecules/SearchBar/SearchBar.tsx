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
    <form onSubmit={handleSubmit} className="flex w-full">
      <Input
        label={label}
        isRequired={isRequired}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="rounded-r-none"
        error={error}
      />
      <Button
        type="submit"
        width="quarter"
        size="md"
        className="rounded-l-none"
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </form>
  );
};

export default SearchBar;
