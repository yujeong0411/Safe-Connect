import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import NavBar from '@components/organisms/NavBar/NavBar';
import { useAuthStore } from '@/store/user/authStore';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface MainTemplateProps {
  children?: React.ReactNode;
  navItems: [];
}

const MainTemplate = ({ children, navItems }: MainTemplateProps) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/user/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* 콘텐츠 영역 */}

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
      {/* 자식 요소 */}
      <div className="flex-1">{children}</div>
    </div>
  );
};
export default MainTemplate;
