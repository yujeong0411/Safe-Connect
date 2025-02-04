import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testStore } from '@/test/store/testAuthStore';
import Button from '@components/atoms/Button/Button';
import Input from '@components/atoms/Input/Input';

const CreateSessionPage: React.FC = () => {
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const createAndJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 세션 생성
      const createdSessionId = await testStore.getState().createSession(sessionId);

      // 직접 세션에 참여할 수 있는 URL 생성
      const inviteUrl = `/test/join/${createdSessionId}?username=${encodeURIComponent(userName)}`;

      // 클립보드에 URL 복사
      await navigator.clipboard.writeText(window.location.origin + inviteUrl);

      // 생성한 세션으로 이동
      navigate(inviteUrl);
    } catch (error) {
      console.error('세션 생성 실패:', error);
      alert('세션 생성에 실패했습니다.');
    }
  };

  return (
    <div className="container">
      <h1>새 화상 회의 만들기</h1>
      <form onSubmit={createAndJoinSession}>
        <Input
          label="세션 이름"
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          width="full"
          variant="blue"
          isRequired
        />
        <Input
          label="참여자 이름"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          width="full"
          variant="blue"
          isRequired
        />
        <Button
          type="submit"
          variant="blue"
          width="full"
        >
          세션 생성 및 초대 링크 복사
        </Button>
      </form>
    </div>
  );
};

export default CreateSessionPage;