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
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-[417px] bg-neutral-100 justify-center p-4">
        <PublicHeader />
        <div className="mx-4 ml-5 md:ml-10 mb-10 md:mb-20">
          <h2 className="text-2xl md:text-[32px] font-bold text-[#181c32] mb-6 md:mb-12 mt-5">회원 가입 절차</h2>
          <SignupProgress currentStep={currentStep} />
        </div>
      </div>

      {/* 메인 콘텐츠 및 버튼 */}
      <div className="flex-1 bg-bg px-4 md:px-20 py-6 md:py-10 flex flex-col justify-between">
        <div>
        <div className="mb-5">
          {/*의료 정보 입력 페이지에서는 노출 안됨*/}
          {currentStep !== 3 && (
            <div className="flex justify-end">
              <span className="text-[#b5b5c3]">이미 가입되어 있나요?</span>
              <Link to="/user/login" className="text-[#3699ff] ml-2">
                로그인
              </Link>
            </div>
          )}
        </div>
          {/* 페이지 콘텐츠 */}
          <div className="flex flex-col justify-center items-center">{children}</div>
        </div>

        {/* 버튼 */}
        <div className="mt-5 pb-6 md:pb-10 flex justify-center">
          <Button
            variant="blue"
            size="lg"
            width="full"
            className="min-w-[200px] max-w-[300px] w-full"
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
