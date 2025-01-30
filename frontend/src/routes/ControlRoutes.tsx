import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/routes/PrivateRoute.tsx';
import PublicRoute from '@/routes/PublicRoute';
import ControlLoginPage from '@pages/ControlPage/ControlLoginPage.tsx';

const ControlRoutes = () => {
  return (
    <Routes>
      {/*인증된 사용자*/}
      <Route element={<PrivateRoute />}></Route>

      {/*인증되지 않은 사용자*/}
      <Route element={<PublicRoute />}>
        <Route path="" element={<ControlLoginPage />} />
      </Route>
    </Routes>
  );
};

export default ControlRoutes;
