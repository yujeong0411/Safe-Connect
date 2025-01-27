import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import NavBar from '@components/organisms/NavBar/NavBar';

interface MainTemplateProps {
  children?: React.ReactNode;
  navItems: [];
}

const MainTemplate = ({ children, navItems }: MainTemplateProps) => {
  return (
    <div className="min-h-screen">
      <div className="relative h-full">
        {/* 상단 배경 */}
        <div className="absolute inset-0 bg-[#F3F5F9] z-10" />
        {/* 콘텐츠 영역 */}
        <div className="relative z-10">
          <PublicHeader labels={[{ label: '로그아웃', href: '/user' }]} />
          <NavBar navItems={navItems} />
          {children}
        </div>
      </div>
    </div>
  );
};
export default MainTemplate;
