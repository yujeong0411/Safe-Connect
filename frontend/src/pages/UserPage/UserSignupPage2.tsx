import React, { useState } from 'react';
import SignupInfoForm from '@/features/auth/components/SignupInfoForm.tsx';
import SignupTemplate from '@components/templates/SignupTemplate.tsx';
import { useNavigate } from 'react-router-dom';
import { FormData } from '@features/auth/types/SignupForm.types.ts';
import { validateSignupForm } from '@features/auth/servies/signupService.ts';

const UserSignupPage2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    isEmailVerified: false,
    name: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    isPhoneVerified: false,
    verificationCode: '',
    residentNumber: '',
    guardianPhone: '',
  });

  const validateFields = (name: keyof FormData, value: string) => {
    // 빈 값에 대해서는 에러 메시지 반환하지 않음
    if (!value) return '';

    const validationResults = validateSignupForm(formData);

    switch (name) {
      case 'email':
        if (!value) return '';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : '올바른 이메일 형식이 아닙니다.';
      case 'password':
        if (!value) return '';
        return value.length >= 8 ? '' : '비밀번호는 8자 이상이어야 합니다.';
      case 'passwordConfirm':
        if (!value) return '';
        return value === formData.password ? '' : ' 비밀번호가 일치하지 않습니다.';
      case 'phoneNumber':
        if (!value) return '';
        return /^\d{3}-\d{4}-\d{4}$/.test(value) ? '' : '올바른 전화번호 형식이 아닙니다.';
      case 'residentNumber':
        if (!value) return '';
        return /^\d{7}$/.test(value) ? '' : '주민등록번호 앞 7자리를 입력해주세요.';
      default:
        return '';
    }
  };

  const handleNext = () => {
    const validationResults = validateSignupForm(formData);
    if (!Object.values(validationResults).every((result) => result)) {
      alert('입력하신 정보를 다시 확인하세요.');
      return;
    }
    navigate('/user/signup/medi', { state: { formData } });
  };

  return (
    <SignupTemplate currentStep={2} buttonText="다음" onButtonClick={handleNext}>
      <SignupInfoForm
        formData={formData}
        setFormData={setFormData}
        validateFields={validateFields}
      />
    </SignupTemplate>
  );
};

export default UserSignupPage2;
