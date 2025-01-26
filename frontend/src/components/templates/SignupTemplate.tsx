import React from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import SignupProgress from '@components/molecules/SignupProgress/SignupProgress.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import { Link } from 'react-router-dom';

interface SignupTemplateProps {
  children: React.ReactNode;
  currentStep: number; // 페이지마다 회원가입 절차 단계 활성화
  buttonText: string;
  onButtonClick: () => void;
}

const SignupTemplate = ({
  children,
  currentStep,
  buttonText,
  onButtonClick,
}: SignupTemplateProps) => {
  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-[417px] bg-neutral-100 justify-center">
        <PublicHeader />
        <div className="ml-20 mb-20">
          <h2 className="text-[32px] font-bold text-[#181c32] mb-12">회원 가입 절차</h2>
          <SignupProgress currentStep={currentStep} />
        </div>
      </div>
      <div className="flex-1 bg-[#f3f5f9] px-20 py-16">
        <div className="flex justify-end mb-10">
          <span className="text-[#b5b5c3]">이미 가입되어 있나요?</span>
          <Link to="/user/login" className="text-[#3699ff] ml-2">
            로그인
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center">
          {children}
          <Button
            variant="blue"
            size="lg"
            width="half"
            className="m-10 w-40"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupTemplate;
