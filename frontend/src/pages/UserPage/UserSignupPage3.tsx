import React from 'react';
import SignupMediForm from '@/features/auth/components/SignupMediForm.tsx';
import SignupTemplate from '@components/templates/SignupTemplate.tsx';
import { useNavigate } from 'react-router-dom';

const UserSignupPage3 = () => {
  const navigate = useNavigate();

  // 회원가입 성공 하면 메인페이지 랜더링
  const handleNext = () => {};
  return (
    // 페이지마다 회원가입 절차 단계 활성화
    <SignupTemplate currentStep={3} buttonText="회원가입" onButtonClick={handleNext}>
      <SignupMediForm />
    </SignupTemplate>
  );
};

export default UserSignupPage3;
