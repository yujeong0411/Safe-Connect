import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/routes/PrivateRoute.tsx';
import PublicRoute from '@/routes/PublicRoute';
import HospitalLoginPage from '@pages/HospitalPage/HospitalLoginPage.tsx';
import HospitalMainPage from '@pages/HospitalPage/HospitalMainPage.tsx';

const HospitalRoutes = () => {
  return (
    <Routes>
      {/*인증된 사용자*/}
      <Route element={<PrivateRoute />}>
        <Route path="request" element={<HospitalMainPage type="request"/>} />
        <Route path="request/detail" element={<HospitalMainPage type="request"/>} />
        <Route path="accept" element={<HospitalMainPage type="accept"/>} />
        <Route path="accept/detail" element={<HospitalMainPage type="accept"/>} />

      </Route>

      {/*인증되지 않은 사용자*/}
      <Route element={<PublicRoute />}>
        <Route path="" element={<HospitalLoginPage />} />
      </Route>
    </Routes>
  );
};

export default HospitalRoutes;
