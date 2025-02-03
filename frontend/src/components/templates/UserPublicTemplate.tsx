import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';

interface MainTemplateProps {
  children?: React.ReactNode;
}

const UserPublicTemplate = ({ children }: MainTemplateProps) => {
  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen">
        {/* 상단 배경 */}
        <div className="absolute inset-0 bg-[#F3F5F9]" />

        {/* 하단 회색 바 */}
        <div className="absolute bottom-[100px] left-0 right-0 h-[155px] bg-[#545F71]" />

        {/* 콘텐츠 영역 */}
        <div className="relative z-10">
          <PublicHeader
            labels={[
              { label: '회원가입', href: '/user/signup' },
              { label: '로그인', href: '/user/login' },
            ]}
          />
          {children}
        </div>
      </div>
    </div>
  );
};
export default UserPublicTemplate;
