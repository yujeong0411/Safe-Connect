import Input from '@components/atoms/Input/Input.tsx';
import React from 'react';
import { FormData } from '@features/auth/types/SignupForm.types.ts';
import { useSignupStore } from '@/store/user/signupStore.tsx';

const UserPwForm = () => {
  // Zustand 스토어에서 상태와 업데이트 함수 가져오기
  const { formData, setFormData, validateFields } = useSignupStore();

  // 입력값 변경 핸들러
  const handleChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ [name]: value });
  };
  return (
    <form className="w-full min-h-full max-w-xl">
      <div
        className="
            flex flex-col gap-10
            "
      >
        <Input
          label="새 비밀번호"
          type="password"
          value={formData.userPassword}
          onChange={handleChange('userPassword')}
          error={validateFields('userPassword', formData.userPassword)}
          width="full"
          isRequired
        />
        <Input
          label="새 비밀번호 확인"
          type="password"
          value={formData.passwordConfirm}
          onChange={handleChange('passwordConfirm')}
          error={validateFields('passwordConfirm', formData.passwordConfirm)}
          width="full"
          isRequired
        />
      </div>
    </form>
  );
};

export default UserPwForm;
