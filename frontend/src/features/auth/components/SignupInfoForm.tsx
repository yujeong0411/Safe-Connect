import React from 'react';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import Input from '@components/atoms/Input/Input';
import SearchBar from '@components/molecules/SearchBar/SearchBar.tsx';
import { FormData } from '@features/auth/types/SignupForm.types.ts';
import { ResidentNumberInput } from '@features/auth/components/ResidentNumberInput.tsx';
import { formatPhoneNumber } from '@features/auth/servies/signupService.ts';
import {
  checkEmailDuplication,
  sendPhoneVerification,
  authCode,
} from '@features/auth/servies/apiService.ts';

const SignupInfoForm = () => {
  const { formData, setFormData, validateFields } = useSignupStore();

  const handleChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const processedValue =
      name === 'userPhone' || name === 'userProtectorPhone' ? formatPhoneNumber(value) : value;

    setFormData({ [name]: processedValue });
  };

  const handleEmailVerify = async () => {
    const result = await checkEmailDuplication(formData.userEmail);
    if (result.isSuccess) {
      setFormData({ isEmailVerified: true });
    }
    alert(result.message);
  };

  const handlePhoneSendVerification = async () => {
    try {
      const isSuccess = await sendPhoneVerification(formData.userPhone);
      if (isSuccess) {
        alert('인증번호가 발송되었습니다.');
      }
    } catch (error) {
      alert('인증번호 발송에 실패했습니다.');
    }
  };

  const handlePhoneVerify = async () => {
    try {
      const isSuccess = await authCode(formData.userPhone, formData.authCode);
      if (isSuccess) {
        setFormData({ isPhoneVerified: true });
        alert('인증이 완료되었습니다.');
      }
    } catch (error) {
      alert('인증번호를 다시 확인해주세요.');
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-left w-full mb-10">기본 정보 입력</h1>
      <div className="flex flex-row gap-10">
        {/*왼쪽*/}
        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {/*이메일 + 중복확인*/}
            <SearchBar
              label="이메일"
              value={formData.userEmail}
              onChange={handleChange('userEmail')}
              onButtonClick={handleEmailVerify}
              buttonText="중복확인"
              error={validateFields('userEmail', formData.userEmail)}
              isRequired
            />
            <Input
              label="이름"
              value={formData.userName}
              onChange={handleChange('userName')}
              isRequired
            />
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
          </div>
        </div>

        {/*오른쪽*/}
        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {/*전화번호*/}
            <SearchBar
              label="전화번호"
              value={formData.userPhone}
              onChange={handleChange('userPhone')}
              onButtonClick={handlePhoneSendVerification}
              placeholder="전화번호를 입력하세요."
              buttonText="전송"
              error={validateFields('userPhone', formData.userPhone)}
              isRequired
            />
            <SearchBar
              label="전화번호 확인"
              value={formData.authCode}
              onChange={handleChange('authCode')}
              onButtonClick={handlePhoneVerify}
              placeholder="문자로 받은 인증번호를 입력하세요."
              buttonText="인증"
              isRequired
            />
            <ResidentNumberInput
              value={formData.userBirthday + formData.userGender}
              onChange={(birthdayAndGender) => {
                setFormData({
                  userBirthday: birthdayAndGender.userBirthday,
                  userGender: birthdayAndGender.userGender,
                });
              }}
            />
            <Input
              label="보호자 연락처"
              value={formData.userProtectorPhone}
              onChange={handleChange('userProtectorPhone')}
              error={validateFields('userProtectorPhone', formData.userProtectorPhone)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupInfoForm;
