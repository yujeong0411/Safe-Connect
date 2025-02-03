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
  isButtonFixed?: boolean; // 버튼 고정 여부 옵션
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

      {/* 메인 콘텐츠 및 버튼 */}
      <div className="flex-1 bg-[#f3f5f9] px-20 py-16 flex flex-col justify-between">
        <div>
          <div className="flex justify-end mb-5">
            <span className="text-[#b5b5c3]">이미 가입되어 있나요?</span>
            <Link to="/user/login" className="text-[#3699ff] ml-2">
              로그인
            </Link>
          </div>
          {/* 페이지 콘텐츠 */}
          <div className="flex flex-col justify-center items-center">{children}</div>
        </div>

        {/* 버튼 */}
        <div className="mt-auto mb-10 flex justify-center">
          <Button
            variant="blue"
            size="lg"
            width="full"
            className="min-w-[200px] max-w-[400px] w-full"
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
