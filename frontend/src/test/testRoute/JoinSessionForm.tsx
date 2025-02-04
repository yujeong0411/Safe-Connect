import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/atoms/Button/Button';
import Input from '@components/atoms/Input/Input';

interface JoinSessionFormProps {
  sessionId?: string;
}

const JoinSessionForm: React.FC<JoinSessionFormProps> = ({ sessionId }) => {
  const [customUsername, setCustomUsername] = useState('');
  const navigate = useNavigate();

  const handleJoinAsGuest = () => {
    // 사용자 이름 생성 로직
    const userName = customUsername ||
      `Guest${Math.floor(Math.random() * 1000)}`;

    // 세션 입장 페이지로 이동 (쿼리 파라미터로 사용자 이름 전달)
    navigate(`/test/join/${sessionId}/room?username=${encodeURIComponent(userName)}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-4 text-center">
          Join Session: {sessionId}
        </h2>

        <div className="mb-4">
          <Input
            label="Custom Username (Optional)"
            type="text"
            value={customUsername}
            onChange={(e) => setCustomUsername(e.target.value)}
            placeholder={`Default: Guest${Math.floor(Math.random() * 1000)}`}
            width="full"
            variant="blue"
          />
        </div>

        <div className="text-center">
          <Button
            variant="blue"
            width="full"
            onClick={handleJoinAsGuest}
          >
            Join as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinSessionForm;