import { TextAreaProps } from './TextArea.types';

const TextArea = ({ value, onChange, placeholder, className }: TextAreaProps) => {
  return (
    <textarea
      className={`w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#545f71] ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
    />
  );
};

export default TextArea;