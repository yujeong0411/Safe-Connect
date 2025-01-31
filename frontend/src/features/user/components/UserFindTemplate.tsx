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
      <div className="flex flex-col items-center justify-center w-full bg-banner h-[300px] p-[50px] text-[#FFFFFF]">
        <h1 className="font-bold text-[50px] mb-10">{title}</h1>
        <p className="text-[20px]">{subtitle}</p>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <main className="flex flex-col items-center justify-center w-full px-4">
        <div className="w-full max-w-2xl">{children}</div>
      </main>

      <div className="flex flex-col w-full space-y-5 mt-10 max-w-xl mx-auto mb-5">
        <Button onClick={primaryButton.onClick}>{primaryButton.text}</Button>
        {/* secondaryButton이 존재할 때만 렌더링 */}
        {secondaryButton && (
          <Button onClick={secondaryButton.onClick} variant="gray">
            {secondaryButton.text}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFindTemplate;
