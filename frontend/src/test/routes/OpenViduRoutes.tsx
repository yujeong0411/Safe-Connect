import { Route, Routes } from 'react-router-dom';
import CreateSessionPage from '@/test/pages/CreateSessionPage';
import JoinSessionPage from '@/test/pages/JoinSessionPage';
import ActiveSessionPage from '@/test/pages/ActiveSessionPage';

const OpenViduRoutes = () => {
  return (
    <Routes>
      <Route path="create" element={<CreateSessionPage />} />
      <Route path="join/:sessionId" element={<JoinSessionPage />}>
        <Route path="room" element={<ActiveSessionPage />} />
      </Route>
      <Route path="session/active" element={<ActiveSessionPage />} />
    </Routes>
  );
};

export default OpenViduRoutes;