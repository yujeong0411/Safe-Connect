import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/routes/PrivateRoute.tsx';
import PublicRoute from '@/routes/PublicRoute';
import AdminLoginPage from '@pages/AdminPage/AdminLoginPage.tsx';
import AdminRegisterPage from '@pages/AdminPage/AdminRegisterPage.tsx';
import AdminServicePage from '@pages/AdminPage/AdminServicePage.tsx';

const AdminRoutes = () => {
  return (
    <Routes>
      {/*인증된 사용자*/}
      <Route element={<PrivateRoute />}>
        {/*서비스 전체 기록(신고, 출동, 이송)*/}
        <Route path="main" element={<AdminServicePage />} />
      </Route>

      {/*인증되지 않은 사용자*/}
      <Route element={<PublicRoute />}>
        <Route path="" element={<AdminLoginPage />} />
        <Route path="firedepart" element={<AdminRegisterPage userType="fire" />} />
        <Route path="hospitaldepart" element={<AdminRegisterPage userType="hospital" />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
