import Input from '@components/atoms/Input/Input.tsx';
//import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useState } from 'react';

const UserFindPwForm = ({ onEmailChange }: { onEmailChange: (email: string) => void }) => {
  // const { formData, setFormData } = useSignupStore();
  const [email, setEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    onEmailChange(newEmail);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center space-y-5 p-10">
      <Input label="이메일" value={email} onChange={handleChange} isRequired />
    </div>
  );
};

export default UserFindPwForm;
