import { SearchBarProps, SearchBarRef } from '@components/molecules/SearchBar/SearchBar.types.ts';
import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

const SearchBar_ver2 = forwardRef<SearchBarRef, SearchBarProps>(
  ({ placeholder = '입력하세요.', buttonText = '검색', onSearch, className, formatValue }, ref) => {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // ref를 통해 외부에서 reset 가능
    useImperativeHandle(ref, () => ({
      reset: () => {
        setValue('');
        inputRef.current?.focus();
      },
    }));

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
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 h-10 px-4 bg-white border border-gray-800  focus:ring-blue-200 focus:ring-2 text-base focus:outline-none rounded max-w-full w-full" // h-10은 40px
        />
        <button
          type="submit"
          className="h-10 px-4 min-w-[5rem] whitespace-nowrap bg-banner text-white text-md rounded-md"
        >
          {buttonText}
        </button>
      </form>
    );
  }
);

export default SearchBar_ver2;
