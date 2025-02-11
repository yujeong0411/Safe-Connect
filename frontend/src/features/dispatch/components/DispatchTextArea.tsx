// src/features/dispatch/components/DispatchTextArea/DispatchTextArea.tsx
import { UseFormRegisterReturn } from 'react-hook-form';
import TextArea from '@/components/atoms/TextArea/TextArea';
import { useState } from 'react';

interface DispatchTextAreaProps {
  placeholder?: string;
  className?: string;
  register: UseFormRegisterReturn;
}

const DispatchTextArea = ({ placeholder, className, register }: DispatchTextAreaProps) => {
  const [value, setValue] = useState('');

  return (
    <TextArea 
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        register.onChange(e); // react-hook-form에도 변경 사항 전달
      }}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default DispatchTextArea;