import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useLocation } from 'react-router-dom';
import {useAdminAuthStore} from "@/store/admin/adminAuthStore.tsx";
import {useHospitalAuthStore} from "@/store/hospital/hospitalAuthStore.tsx";
import {useControlAuthStore} from "@/store/control/controlAuthStore.tsx";
import {useDispatchAuthStore} from "@/store/dispatch/dispatchAuthStore.tsx";

const PublicRoute = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // 현재 경로에 따라 적절한 store의 인증 상태를 확인
  const isAuthenticated = () => {
    if (path.includes('/hospital')) return useHospitalAuthStore(state => state.isAuthenticated);
    if (path.includes('/control')) return useControlAuthStore(state => state.isAuthenticated);
    if (path.includes('/dispatch')) return useDispatchAuthStore(state => state.isAuthenticated);
    if (path.includes('/admin')) return useAdminAuthStore(state => state.isAuthenticated);
    return useAuthStore(state => state.isAuthenticated);
  };

  // 각 도메인별 메인 페이지 경로 반환
  const getRedirectPath = () => {
    if (path.includes('/hospital')) return '/hospital/request';
    if (path.includes('/control')) return '/control/main';
    if (path.includes('/dispatch')) return '/dispatch/main';
    if (path.includes('/admin')) return '/admin/main';
    return '/user/main';
  };

  // 이미 로그인한 사용자는 메인 페이지로 리다이렉트
  if (isAuthenticated()) {
    return <Navigate to={getRedirectPath()} replace />;
  }


  return <Outlet />;
};

export default PublicRoute;
