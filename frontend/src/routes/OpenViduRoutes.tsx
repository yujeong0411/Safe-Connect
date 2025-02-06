import { Route, Routes } from 'react-router-dom';
import CreateSessionPage from '@pages/openvidu/CreateSessionPage.tsx';
import JoinSessionPage from '@pages/openvidu/JoinSessionPage.tsx';
import ActiveSessionPage from '@pages/openvidu/ActiveSessionPage.tsx';

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