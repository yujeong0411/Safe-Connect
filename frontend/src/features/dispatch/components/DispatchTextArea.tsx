import { UseFormRegisterReturn } from 'react-hook-form';
import TextArea from '@/components/atoms/TextArea/TextArea';

interface DispatchTextAreaProps {
  placeholder?: string;
  className?: string;
  register: UseFormRegisterReturn;
}

const DispatchTextArea = ({ placeholder, className, register }: DispatchTextAreaProps) => {
  return <TextArea placeholder={placeholder} className={className} {...register} />;
};

export default DispatchTextArea;
