import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import NavBar from '@components/organisms/NavBar/NavBar';
import React from 'react';
import Footer from '@components/organisms/Footer/Footer';
// NavBar props type 변경으로 추가...
import {NavItem} from "@components/organisms/NavBar/NavBar.types.ts";


interface MainTemplateProps {
  children?: React.ReactNode;
  navItems: NavItem[];
  logoutDirect: () => void | Promise<void>;
}

const MainTemplate = ({ children, navItems, logoutDirect }: MainTemplateProps) => {

  const handleLogout = async () => {
    try {
      await logoutDirect()  // 각 페이지에서 로그아웃 함수 전달
      // 페이지 이동은 각 스토어에서
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-bg">
      {/* 콘텐츠 영역 */}
        <div className="-space-y-2">  {/* 음수 마진으로 간격을 줄임 */}
      <PublicHeader
        labels={[
          {
            label: '로그아웃',
            href: '#',
            onClick: handleLogout,
          },
        ]}
      />
      <NavBar navItems={navItems} />
        </div>
      {/* 자식 요소 */}
      <div className="flex items-center justify-center mb-auto">{children}</div>
        <Footer />
    </div>
  );
};
export default MainTemplate;
