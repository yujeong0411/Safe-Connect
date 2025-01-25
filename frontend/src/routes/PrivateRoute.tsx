import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore.tsx';

const PrivateRoute = () => {
  const { token, userType } = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default PrivateRoute;
