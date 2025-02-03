
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionService } from './SessionService';

const CreateRoomPage: React.FC = () => {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert('방 이름을 입력해주세요.');
      return;
    }

    try {
      // 세션 및 토큰 생성
      const { sessionId, token } = await SessionService.createSessionAndToken(roomName);

      // 게임 페이지로 이동
      navigate('/test/game', {
        state: {
          roomId: roomName,
          sessionId,
          token
        }
      });
    } catch (error) {
      console.error('방 생성 중 오류:', error);
      alert('방 생성에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">방 만들기</h1>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="방 이름을 입력하세요"
          className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateRoom}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          방 생성
        </button>
      </div>
    </div>
  );
};

export default CreateRoomPage;