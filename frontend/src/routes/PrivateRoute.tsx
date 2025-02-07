import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useLocation } from 'react-router-dom';
import {LOGIN_PATH} from "@/routes/LogoutPathRoutes.ts";
import {useAdminAuthStore} from "@/store/admin/adminAuthStore.tsx";
import {useHospitalAuthStore} from "@/store/hospital/hospitalAuthStore.tsx";
import {useControlAuthStore} from "@/store/control/controlAuthStore.tsx";
import {useDispatchAuthStore} from "@/store/dispatch/dispatchAuthStore.tsx";

const PrivateRoute = () => {
  // const { isAuthenticated } = useAuthStore();
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

  if (!isAuthenticated()) {
    return <Navigate to={path.includes('/hospital') ? LOGIN_PATH.HOSPITAL
        : path.includes('/control') ? LOGIN_PATH.CONTROL
            : path.includes('/dispatch') ? LOGIN_PATH.DISPATCH
                : path.includes('/admin') ? LOGIN_PATH.ADMIN
                    : LOGIN_PATH.USER}
    />;
  }
  return <Outlet />;
};
export default PrivateRoute;
