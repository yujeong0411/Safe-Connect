import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';
// import { useEffect } from 'react';

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // 컴포넌트 마운트 시 로그인 상태 확인
  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // 이미 로그인한 사용자는 메인 페이지로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to="/user/main" />;
  }

  return <Outlet />;
};

export default PublicRoute;
