
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateRoomPage from './CreateRoomPage';
import JoinRoomPage from './JoinRoomPage';
import GamePage from './GamePage.tsx';

const TestRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateRoomPage />} />
      <Route path="/join" element={<JoinRoomPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
};

export default TestRoutes;
