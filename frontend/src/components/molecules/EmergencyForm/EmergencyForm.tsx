import React from 'react';
import Input from '@components/atoms/Input/Input';

interface EmergencyFormProps {
  onSubmit: (data: any) => void;
}

const EmergencyForm = ({ onSubmit }: EmergencyFormProps) => {
  return (
    <form className="grid grid-cols-2 gap-4">
      <Input label="성명" width="full" />
      <Input label="신고자" width="full" />
      <Input label="나이" width="full" />
      <Input label="연락처" width="full" />
      <div className="col-span-2">
        <Input
          label="증상"
          width="full"
          className="h-32" // multiline 대신 높이 지정
        />
      </div>
    </form>
  );
};

export default EmergencyForm;
