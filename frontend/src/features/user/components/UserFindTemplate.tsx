import React from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import Footer from '@components/organisms/Footer/Footer.tsx';

interface UserFindTemplateProps {
  title: string;
  children?: React.ReactNode;
  subtitle: string;
  primaryButton: { text: string; onClick: () => void };
  secondaryButton?: { text: string; onClick: () => void };
}

const UserFindTemplate = ({
  title,
  children,
  subtitle,
  primaryButton,
  secondaryButton,
}: UserFindTemplateProps) => {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <PublicHeader
        labels={[
          { label: '회원가입', href: '/user/signup' },
          { label: '로그인', href: '/user/login' },
        ]}
      />

      {/*타이틀 영역 */}
      <div className="flex flex-col items-center justify-center w-full bg-banner
                    h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px]
                    p-4 sm:p-6 md:p-8 lg:p-[50px]
                    text-white">
        <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-[50px] mb-2 sm:mb-3 md:mb-4 lg:mb-5 text-center">{title}</h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-[20px] font-sans text-center">{subtitle}</p>
      </div>

        {/* 메인 컨텐츠와 버튼을 감싸는 컨테이너 */}
        <div className="flex-1 flex flex-col gap-2 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
            {/* 메인 컨텐츠 영역 */}
            {children && (
                <main className="flex flex-col items-center w-full">
                    <div className="w-full max-w-2xl">{children}</div>
                </main>
            )}

            {/* 버튼 영역 */}
            <div className={`flex flex-col w-full space-y-5 max-w-xl mx-auto ${!children ? 'mt-10' : 'mb-5'}`}>
                <Button onClick={primaryButton.onClick}>{primaryButton.text}</Button>
                {secondaryButton && (
                    <Button onClick={secondaryButton.onClick} variant="gray">
                        {secondaryButton.text}
                    </Button>
                )}
            </div>
        </div>
        <Footer/>
    </div>
  );
};

export default UserFindTemplate;
