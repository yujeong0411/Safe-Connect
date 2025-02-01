// import { Routes, Route } from 'react-router-dom';
// import PrivateRoute from '@/routes/PrivateRoute.tsx';
// import PublicRoute from '@/routes/PublicRoute';
// import ControlLoginPage from '@pages/ControlPage/ControlLoginPage.tsx';
// import ControlMainPage from '@pages/ControlPage/ControlMainPage.tsx';

// const ControlRoutes = () => {
//   return (
//     <Routes>
//       {/*인증된 사용자*/}
//       <Route element={<PrivateRoute />}>
//         <Route path="main" element={<ControlMainPage />} />
//         {/* 추후 다른 인증된 라우트들 추가 */}
//       </Route>

//       {/*인증되지 않은 사용자*/}
//       <Route element={<PublicRoute />}>
//         <Route path="" element={<ControlLoginPage />} />
//       </Route>
//     </Routes>
//   );
// };

// export default ControlRoutes;

// src/routes/ControlRoutes.tsx
// src/routes/ControlRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ControlMainPage from '@pages/ControlPage/ControlMainPage';
import PatientInfoPage from '@pages/ControlPage/PatientInfoPage';
import DispatchPage from '@pages/ControlPage/DispatchPage';
import EmergencyLogPage from '@pages/ControlPage/EmergencyLogPage';
import EmergencyDetailPage from '@pages/ControlPage/EmergencyDetailPage';

const ControlRoutes = () => {
  return (
    <Routes>
      {/* /Control로 접근시 /Control/main으로 리다이렉트 */}
      <Route path="" element={<Navigate to="main" replace />} />

      {/* 메인 라우트들 */}
      <Route path="main" element={<ControlMainPage />} />
      <Route path="patient-info" element={<PatientInfoPage />} />
      <Route path="dispatch" element={<DispatchPage />} />
      <Route path="logs" element={<EmergencyLogPage />} />
      <Route path="logs/:id" element={<EmergencyDetailPage />} />

      {/* 잘못된 경로로 접근시 메인으로 리다이렉트 */}
      <Route path="*" element={<Navigate to="main" replace />} />
    </Routes>
  );
};

export default ControlRoutes;
