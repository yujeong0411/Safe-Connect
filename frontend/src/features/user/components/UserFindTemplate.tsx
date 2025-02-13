import React from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import Button from '@components/atoms/Button/Button.tsx';

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
      <div className="flex flex-col items-center justify-center w-full bg-banner h-[200px] p-[50px] text-[#FFFFFF]">
        <h1 className="font-sans text-[50px] mb-5">{title}</h1>
        <p className="text-[20px] font-sans">{subtitle}</p>
      </div>

        {/* 메인 컨텐츠와 버튼을 감싸는 컨테이너 */}
        <div className={'flex-1 flex flex-col gap-2'}>
            {/* 메인 컨텐츠 영역 */}
            {children && (
                <main className="flex flex-col items-center w-full px-4">
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
    </div>
  );
};

export default UserFindTemplate;
