import UserRoutes from '@/routes/UserRoutes.tsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DispatchRoutes from '@/routes/DispatchRoutes.tsx';
import HospitalRoutes from '@/routes/HospitalRoutes.tsx';
import AdminRoutes from '@/routes/AdminRoutes.tsx';
import ControlRoutes from '@/routes/ControlRoutes.tsx';
import CallerRoutes from '@/routes/CallerRoutes.tsx';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*초기화면*/}
        <Route path="/" element={<Navigate to="/user" replace />} />

        {/*일반 사용자*/}
        <Route path="/user/*" element={<UserRoutes />} />

        {/*상황실*/}
        <Route path="/control/*" element={<ControlRoutes />} />

        {/*구급대원*/}
        <Route path="/dispatch/*" element={<DispatchRoutes />} />

        {/*병원*/}
        <Route path="/hospital/*" element={<HospitalRoutes />} />

        {/*관리자*/}
        <Route path="/admin/*" element={<AdminRoutes />} />


        {/*  Caller*/}
        <Route path="/caller/*" element={<CallerRoutes/>} />

      </Routes>
    </BrowserRouter>
  );
};

export default Router;
