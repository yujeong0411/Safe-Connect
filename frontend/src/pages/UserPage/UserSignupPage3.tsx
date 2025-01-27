import React, { useState } from 'react';
import SignupMediForm from '@/features/auth/components/SignupMediForm.tsx';
import SignupTemplate from '@components/templates/SignupTemplate.tsx';
import { FormData } from '@features/auth/types/SignupForm.types.ts';
import { handleSignUp } from '@features/auth/servies/apiService.ts';
import { useLocation } from 'react-router-dom';

const UserSignupPage3 = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>(location.state?.formData || {});

  const handleNext = async () => {
    await handleSignUp(formData);
  };
  return (
    // 페이지마다 회원가입 절차 단계 활성화
    <SignupTemplate currentStep={3} buttonText="회원가입" onButtonClick={handleNext}>
      <h1 className="text-3xl font-bold text-left w-full mb-10">의료 정보 입력</h1>
      <SignupMediForm formData={formData} setFormData={setFormData} />
    </SignupTemplate>
  );
};

export default UserSignupPage3;
