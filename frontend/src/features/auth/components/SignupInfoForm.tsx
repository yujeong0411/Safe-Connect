import React from 'react';
import Input from '@components/atoms/Input/Input';
import { SignupInfoFormProps } from '@features/auth/types/SignupForm.types.ts';
import SearchBar from '@components/molecules/SearchBar/SearchBar.tsx';
import { FormData } from '@features/auth/types/SignupForm.types.ts';
import { ResidentNumberInput } from '@features/auth/components/ResidentNumberInput.tsx';
import { formatPhoneNumber } from '@features/auth/servies/signupService.ts';
import {
  checkEmailDuplication,
  sendPhoneVerification,
  verifyPhoneCode,
} from '@features/auth/servies/apiService.ts';

const SignupInfoForm: React.FC<SignupInfoFormProps> = ({
  formData,
  setFormData,
  validateFields,
}) => {
  // 1. name: 폼 데이터의 특정 키 (예: 'email', 'password')를 받음
  // 2. e: 입력 이벤트 객체
  const handleChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const processedValue = name === 'phoneNumber' ? formatPhoneNumber(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleEmailVerify = async () => {
    try {
      const isSuccess = await checkEmailDuplication(formData.email);
      if (isSuccess) {
        setFormData((prev) => ({ ...prev, isEmailVerified: true }));
        alert('사용가능한 이메일입니다.');
      }
    } catch (error) {
      alert(error.message || '이메일 중복 확인에 실패했습니다.');
    }
  };

  const handlePhoneSendVerification = async () => {
    try {
      const isSuccess = await sendPhoneVerification(formData.phoneNumber);
      if (isSuccess) {
        alert('인증번호가 발송되었습니다.');
      }
    } catch (error) {
      alert('인증번호 발송에 실패했습니다.');
    }
  };

  const handlePhoneVerify = async () => {
    try {
      const isSuccess = await verifyPhoneCode(formData.phoneNumber, formData.verificationCode);
      if (isSuccess) {
        setFormData((prev) => ({ ...prev, isPhoneVerified: true }));
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
              value={formData.email}
              onChange={handleChange('email')}
              onButtonClick={handleEmailVerify}
              buttonText="중복확인"
              error={validateFields('email', formData.email)}
              isRequired
            />
            <Input label="이름" value={formData.name} onChange={handleChange('name')} isRequired />
            <Input
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={validateFields('password', formData.password)}
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
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              onButtonClick={handlePhoneSendVerification}
              placeholder="전화번호를 입력하세요."
              buttonText="전송"
              error={validateFields('phoneNumber', formData.phoneNumber)}
              isRequired
            />
            <SearchBar
              label="전화번호 확인"
              value={formData.verificationCode}
              onChange={handleChange('verificationCode')}
              onButtonClick={handlePhoneVerify}
              placeholder="문자로 받은 인증번호를 입력하세요."
              buttonText="인증"
              isRequired
            />
            <ResidentNumberInput />
            <Input
              label="보호자 연락처"
              value={formData.guardianPhone}
              onChange={handleChange('guardianPhone')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupInfoForm;
