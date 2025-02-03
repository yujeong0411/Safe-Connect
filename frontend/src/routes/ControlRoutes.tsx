import { Routes, Route, Navigate } from 'react-router-dom';
import PatientInfoPage from '@/pages/ControlPage/PatientInfoPage';
import DispatchPage from '@/pages/ControlPage/DispatchPage';
import ControlLoginPage from '@/pages/ControlPage/ControlLoginPage';
import ControlLogPage from '@/pages/ControlPage/ControlLogPage';

const ControlRoutes = () => {
  return (
    <Routes>
      {/* /Control로 접근시 /Control/main으로 리다이렉트 */}
      <Route path="" element={<Navigate to="logs" replace />} />

      {/* 메인 라우트들 */}
      <Route path="login" element={<ControlLoginPage />} />
      <Route path="patient-info" element={<PatientInfoPage />} />
      <Route path="dispatch" element={<DispatchPage />} />
      <Route path="logs" element={<ControlLogPage />} />

      {/* 잘못된 경로로 접근시 메인으로 리다이렉트 */}
      <Route path="*" element={<Navigate to="logs" replace />} />
    </Routes>
  );
};

export default ControlRoutes;
