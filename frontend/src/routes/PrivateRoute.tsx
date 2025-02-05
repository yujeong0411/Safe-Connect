import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  const getRedirectPath = () => {
    const path = location.pathname.toLowerCase();

    if (path.includes('/hospital')) return '/hospital';
    if (path.includes('/control')) return '/control';
    if (path.includes('/dispatch')) return '/dispatch';
    if (path.includes('/admin')) return '/admin';
    return '/user/login';
  };

  if (!isAuthenticated) {
    return <Navigate to={getRedirectPath()} />;
  }

  return <Outlet />;
};
export default PrivateRoute;
