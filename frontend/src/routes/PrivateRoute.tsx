import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }

  return <Outlet />;
};
export default PrivateRoute;
