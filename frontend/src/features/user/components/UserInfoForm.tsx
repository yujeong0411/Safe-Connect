import { formatPhoneNumber } from '@features/auth/servies/signupService.ts';
import { validatePhoneNumber } from '@utils/validation';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import { SignupStore } from '@/store/user/signupStore.tsx';
import React from 'react';

const UserInfoForm = () => {
  const { formData, setFormData } = useSignupStore();

  const handleChange =
    (name: keyof SignupStore['formData']) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const processedValue =
        name === 'userPhone' || name === 'userProtectorPhone' ? formatPhoneNumber(value) : value;
      setFormData({ [name]: processedValue });
    };

  return (
    <div className="w-full flex flex-row gap-20 max-w-4xl">
      {/*왼쪽*/}
      <div className="flex-1">
        <div className="flex flex-col gap-5">
          {/*이메일 (비활성화)*/}
          <Input
            label="이메일"
            value={formData.userEmail}
            onChange={handleChange('userEmail')}
            isRequired
            disabled={true}
          />
          <Input
            label="이름"
            value={formData.userName}
            onChange={handleChange('userName')}
            isRequired
            disabled
          />
          <Input
            label="전화번호"
            value={formData.userPhone}
            onChange={handleChange('userPhone')}
            error={
              formData.userPhone && !validatePhoneNumber(formData.userPhone)
                ? '올바른 전화번호 형식이 아닙니다.'
                : ''
            }
            isRequired
          />
        </div>
      </div>

      {/*오른쪽*/}
      <div className="flex-1">
        <div className="flex flex-col gap-5">
          {/*주민등록번호 (비활성화)*/}
          <Input
            label="성별"
            value={formData.userGender}
            onChange={handleChange('userGender')}
            disabled={true}
            isRequired
          />
          <Input
            label="생년월일"
            value={formData.userBirthday}
            onChange={handleChange('userBirthday')}
            disabled={true}
            isRequired
          />
          <Input
            label="보호자 연락처"
            value={formData.userProtectorPhone}
            onChange={handleChange('userProtectorPhone')}
            error={
              formData.userProtectorPhone && !validatePhoneNumber(formData.userProtectorPhone)
                ? '올바른 전화번호 형식이 아닙니다.'
                : ''
            }
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
