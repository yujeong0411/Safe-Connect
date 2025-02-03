import { Routes, Route} from 'react-router-dom';
import ControlMainPage from '@pages/ControlPage/ControlMainPage';
import PatientInfoPage from '@pages/ControlPage/PatientInfoPage';
import DispatchPage from '@pages/ControlPage/DispatchPage';
import EmergencyLogPage from '@pages/ControlPage/EmergencyLogPage';
import EmergencyDetailPage from '@pages/ControlPage/EmergencyDetailPage';
import ControlLoginPage from '@pages/ControlPage/ControlLoginPage.tsx';

const ControlRoutes = () => {
  return (
    <Routes>
      {/* /Control로 접근시 /Control/main으로 리다이렉트 */}

      {/* 메인 라우트들 */}
      <Route path="" element={<ControlLoginPage />} />
      <Route path="main" element={<ControlMainPage />} />
      <Route path="patient-info" element={<PatientInfoPage />} />
      <Route path="dispatch" element={<DispatchPage />} />
      <Route path="logs" element={<EmergencyLogPage />} />
      <Route path="logs/:id" element={<EmergencyDetailPage />} />


    </Routes>
  );
};

export default ControlRoutes;
