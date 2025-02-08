import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/routes/PrivateRoute.tsx';
import PublicRoute from '@/routes/PublicRoute';
import ControlPatientInfoPage from '@/pages/ControlPage/ControlPatientInfoPage';
import ControlDispatchOrderPage from '@pages/ControlPage/ControlDispatchOrderPage.tsx';
import ControlLoginPage from '@/pages/ControlPage/ControlLoginPage';
import ControlMainPage from '@/pages/ControlPage/ControlMainPage';
import Maps from '@features/control/components/KakaoMap.tsx';

const ControlRoutes = () => {
  return (
    <Routes>
      {/*인증된 사용자*/}
       <Route element={<PrivateRoute />}>
        <Route path="main" element={<ControlMainPage />} />
        <Route path="patient-info" element={<ControlPatientInfoPage />} />
        <Route path="dispatch-order" element={<ControlDispatchOrderPage />} />
       </Route>

      {/*인증되지 않은 사용자*/}
      <Route element={<PublicRoute />}>
        <Route path="" element={<ControlLoginPage />} />
        <Route path="map" element={<Maps />} />
      </Route>
    </Routes>
  );
};

export default ControlRoutes;
