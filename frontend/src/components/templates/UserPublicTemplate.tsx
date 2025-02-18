import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import Footer from "@components/organisms/Footer/Footer.tsx";

interface MainTemplateProps {
  children?: React.ReactNode;
}

const UserPublicTemplate = ({ children }: MainTemplateProps) => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="relative flex-grow">
        {/* 상단 배경 */}
        <div className="absolute inset-0 bg-bg" />

        {/* 하단 회색 바 */}
        <div className="absolute bottom-[40px] md:bottom-[60px]
                       left-0 right-0
                       h-[100px] sm:h-[120px] md:h-[155px]
                       bg-banner" />

        {/* 콘텐츠 영역 */}
          <div className="relative z-10 px-4 sm:px-6 md:px-8">
              <PublicHeader
                  labels={[
                      {label: '회원가입', href: '/user/signup'},
                      {label: '로그인', href: '/user/login'},
                  ]}
              />
              <div className="w-full max-w-screen-xl mx-auto"> {/* 최대 너비 제한 및 중앙 정렬 */}
                  {children}
              </div>
          </div>
      </div>
        <Footer/>
    </div>
  );
};
export default UserPublicTemplate;
