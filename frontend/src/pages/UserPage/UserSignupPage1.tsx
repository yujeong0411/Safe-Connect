import SignupTemplate from '@features/auth/components/SignupTemplate.tsx';
import SignupPerForm from '@/features/auth/components/SignupPerForm.tsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const UserSignupPage1 = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  // 동의서 체크 후 다음 페이지 넘어가기
  const handleNext = () => {
    if (!isChecked) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    navigate('/user/signup/info');
  };

  return (
    // 페이지마다 회원가입 절차 단계 활성화
    <SignupTemplate currentStep={1} buttonText="다음" onButtonClick={handleNext}>
      <SignupPerForm isChecked={isChecked} setIsChecked={setIsChecked} />
    </SignupTemplate>
  );
};

export default UserSignupPage1;
