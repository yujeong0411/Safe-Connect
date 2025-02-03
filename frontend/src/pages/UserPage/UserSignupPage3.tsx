import { useSignupStore } from '@/store/user/signupStore';
import SignupMediForm from '@/features/auth/components/SignupMediForm.tsx';
import SignupTemplate from '@features/auth/components/SignupTemplate.tsx';
import { handleSignUp } from '@features/auth/servies/apiService.ts';
import { useNavigate } from 'react-router-dom';

const UserSignupPage3 = () => {
  const navigate = useNavigate();
  const { formData, resetFormData } = useSignupStore();

  const handleNext = async () => {
    try {
      await handleSignUp(formData, navigate, resetFormData);
    } catch (error) {
      console.error('회원가입 실패', error);
    }
  };
  return (
    // 페이지마다 회원가입 절차 단계 활성화
    <SignupTemplate
      currentStep={3}
      buttonText="회원가입"
      onButtonClick={handleNext}
      isButtonFixed={true}
    >
      <h1 className="text-3xl font-bold text-left w-full mb-10">의료 정보 입력</h1>
      <SignupMediForm />
    </SignupTemplate>
  );
};

export default UserSignupPage3;
