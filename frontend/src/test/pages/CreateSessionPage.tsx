
import React, { useEffect } from 'react';
import { useOpenViduStore } from '@/test/store/OpenViduStore';
import Button from '@components/atoms/Button/Button';
import { useNavigate } from 'react-router-dom';
const CreateSessionPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    sessionId,
    handleChangeSessionId,
    handleChangeUserName,
    createAndJoinSession
  } = useOpenViduStore();

  useEffect(() => {
    // 세션 ID 자동 생성 (타임스탬프 + UUID)
    const timestamp = new Date().getTime();
    const uniqueId = "23452341";
    const sessionId = `${timestamp}-${uniqueId}`;

    // 세션 ID 설정
    handleChangeSessionId({
      target: { value: sessionId }
    } as React.ChangeEvent<HTMLInputElement>);

    // 호스트 이름 설정
    handleChangeUserName({
      target: { value: `Host-23452341` }
    } as React.ChangeEvent<HTMLInputElement>);
  }, [handleChangeSessionId, handleChangeUserName]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAndJoinSession(e);
      const inviteUrl = `/openvidu/join/${sessionId}?direct=true`;
      await navigator.clipboard.writeText(window.location.origin + inviteUrl);
      navigate(`/openvidu/session/active`);

    } catch (error) {
      console.error('세션 생성 실패:', error);
      alert('세션 생성에 실패했습니다.');
    }
  };

  return (
    <div className="container">
      <h1>화상 회의 생성하기</h1>
      <div className="text-center mt-8">
        <div onClick={handleCreateSession}>
          <Button
            variant="blue"
            width="full"
          >
            새 화상 회의 시작 및 초대 링크 복사
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionPage;