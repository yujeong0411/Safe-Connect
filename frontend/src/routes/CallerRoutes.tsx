import { Route, Routes } from 'react-router-dom';
import CallerPage from '@pages/CallerPage/CallerPage.tsx';
import CallerErrorPage from '@pages/CallerPage/CallerErrorPage.tsx';
import CallerJoinPage from '@pages/CallerPage/CallerJoinPage.tsx';
import CallerEndPage from '@pages/CallerPage/CallerEndPage.tsx';

const CallerRoutes = () => {
  return (
    <Routes>
      {/* 모든 사용자 접근 가능 */}
      <Route path="" element={<CallerPage />} />
      <Route path="error" element={<CallerErrorPage/>}/>
      <Route path="join/:sessionId" element={<CallerJoinPage />}/>
      <Route path="end" element={<CallerEndPage/>}/>
    </Routes>
  );
};

export default CallerRoutes;
