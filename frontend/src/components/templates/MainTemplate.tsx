import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import NavBar from '@components/organisms/NavBar/NavBar';

interface MainTemplateProps {
  children?: React.ReactNode;
  navItems: [];
}

const MainTemplate = ({ children, navItems }: MainTemplateProps) => {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* 콘텐츠 영역 */}

      <PublicHeader labels={[{ label: '로그아웃', href: '/user' }]} />
      <NavBar navItems={navItems} />
      {/* 자식 요소 */}
      <div className="flex-1">{children}</div>
    </div>
  );
};
export default MainTemplate;
