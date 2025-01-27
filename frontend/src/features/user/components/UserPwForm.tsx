import Input from '@components/atoms/Input/Input.tsx';
import React from 'react';
import { FormData, SignupInfoFormProps } from '@features/auth/types/SignupForm.types.ts';

const UserPwForm = ({ formData, setFormData, validateFields }: SignupInfoFormProps) => {
  const handleChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <form className="p-4 md:p-0">
      <div
        className="
          w-full
          px-6             // 모바일에서 좌우 패딩
          md:px-[65px]     // 중간 화면에서 원래 패딩
          py-8            // 모바일에서 상하 패딩
          md:py-[39px]    // 중간 화면에서 원래 패딩
          "
      >
        <div
          className="
            flex flex-col
            gap-[8px]
            w-full
            "
        >
          <Input
            label="비밀번호"
            type="password"
            value={formData.userPassword}
            onChange={handleChange('userPassword')}
            error={validateFields('userPassword', formData.userPassword)}
            isRequired
          />
          <Input
            label="비밀번호 확인"
            type="password"
            value={formData.passwordConfirm}
            onChange={handleChange('passwordConfirm')}
            error={validateFields('passwordConfirm', formData.passwordConfirm)}
            isRequired
          />

          <div className="felx flex-col w-full mt-5 "></div>
        </div>
      </div>
    </form>
  );
};

export default UserPwForm;
