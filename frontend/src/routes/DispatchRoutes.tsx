import { Routes, Route } from 'react-router-dom';
import PublicRoute from '@/routes/PublicRoute';
import DispatchPage from '@/pages/DispatchPage';
import PatientInfoPage from '@/pages/DispatchPage/PatientInfoPage';
import TransferRequestPage from '@/pages/DispatchPage/TransferRequestPage';
import DispatchLoginPage from '@/pages/DispatchPage/DispatchLoginPage';

const DispatchRoutes = () => {
  return (
    <Routes>
      {/* 인증된 사용자 */}
      <Route element={<PrivateRoute />}>
        <Route path="main" element={<DispatchPage />} />
        <Route path="patient-info" element={<PatientInfoPage />} />
        <Route path="transfer-request" element={<TransferRequestPage />} />
      </Route>

      {/* 인증되지 않은 사용자 */}
      <Route element={<PublicRoute />}>
        <Route path="" element={<DispatchLoginPage />} />
      </Route>
    </Routes>
  );
};

export default DispatchRoutes;