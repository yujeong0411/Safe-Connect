
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionService } from './SessionService';

const JoinRoomPage: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      alert('방 코드를 입력해주세요.');
      return;
    }

    try {
      // 세션 및 토큰 생성
      const { sessionId, token} = await SessionService.createSessionAndToken(roomCode);

      // 게임 페이지로 이동
      navigate('/test/game', {
        state: {
          roomId: roomCode,
          sessionId,
          token
        }
      });
    } catch (error) {
      console.error('방 입장 중 오류:', error);
      alert('방 입장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">방 참가</h1>
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="방 코드를 입력하세요"
          className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleJoinRoom}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          방 참가
        </button>
      </div>
    </div>
  );
};

export default JoinRoomPage;