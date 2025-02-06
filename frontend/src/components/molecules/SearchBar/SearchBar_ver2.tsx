import { SearchBarProps } from '@components/molecules/SearchBar/SearchBar.types.ts';
import React, { useState } from 'react';

const SearchBar_ver2 = ({
  placeholder = '입력하세요.',
  buttonText = '검색',
  onSearch,
  className,
    formatValue,
}: SearchBarProps) => {
  const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = formatValue ? formatValue(e.target.value) : e.target.value;
        setValue(newValue);
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(value);
  };
  return (
    <form onSubmit={handleSubmit} className={`flex gap-5 w-full ${className}`}>
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 h-10 px-4 bg-white border border-black  focus:border-focus focus:ring-1 text-base focus:outline-none rounded max-w-full w-full" // h-10은 40px
      />
      <button
        type="submit"
        className="h-10 px-4 min-w-[90px] whitespace-nowrap bg-banner text-white text-md rounded"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default SearchBar_ver2;
