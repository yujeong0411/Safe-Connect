import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/routes/PrivateRoute.tsx';
import PublicRoute from '@/routes/PublicRoute';
import DispatchLoginPage from '@pages/DispatchPage/DispatchLoginPage.tsx';

const DispatchRoutes = () => {
  return (
    <Routes>
      {/*인증된 사용자*/}
      <Route element={<PrivateRoute />}></Route>

      {/*인증되지 않은 사용자*/}
      <Route element={<PublicRoute />}>
        <Route path="" element={<DispatchLoginPage />} />
      </Route>
    </Routes>
  );
};

export default DispatchRoutes;
