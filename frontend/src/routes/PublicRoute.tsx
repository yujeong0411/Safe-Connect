import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useLocation } from 'react-router-dom';

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  const getRedirectPath = () => {
    const path = location.pathname.toLowerCase();

    if (path.includes('/hospital')) return '/hospital/request';
    if (path.includes('/control')) return '/control/main';
    if (path.includes('/dispatch')) return '/dispatch/main';
    if (path.includes('/admin')) return '/admin/main';
    return '/user/main';
  };

  // 이미 로그인한 사용자는 메인 페이지로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to={getRedirectPath()} />;
  }

  return <Outlet />;
};

export default PublicRoute;
