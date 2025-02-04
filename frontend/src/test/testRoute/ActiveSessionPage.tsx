import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { testStore } from '@/test/store/testAuthStore';
import VideoSessionUI from './VideoSessionUI';
import { OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';

interface ActiveSessionPageProps {
  sessionId?: string;
}

const ActiveSessionPage: React.FC<ActiveSessionPageProps> = ({ sessionId }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userName = searchParams.get('username') ||
    `Guest${Math.floor(Math.random() * 1000)}`;

  const [ovState, setOvState] = useState({
    mySessionId: sessionId || 'DefaultSession',
    myUserName: userName,
    session: undefined as Session | undefined,
    mainStreamManager: undefined as StreamManager | undefined,
    publisher: undefined as Publisher | undefined,
    subscribers: [] as Subscriber[],
  });

  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // OpenVidu 초기화 로그
        console.log('Initializing session with:', {
          sessionId: ovState.mySessionId,
          userName: ovState.myUserName
        });

        // 세션 생성 및 토큰 획득 로직 추가
        const createdSessionId = await testStore.getState().createSession(ovState.mySessionId);
        console.log('Created Session ID:', createdSessionId);

        const token = await testStore.getState().createToken(createdSessionId);
        console.log('Received Token:', token);

        const OV = new OpenVidu();
        const session = OV.initSession();

        // 이벤트 리스너 추가 (에러 포함)
        session.on('connectionCreated', (event) => {
          console.log('Connection Created:', event);
        });

        session.on('exception', (exception) => {
          console.error('Session Exception:', exception);
          setConnectionError(exception.message);
        });

        // 세션 연결 시도
        await session.connect(token, {
          clientData: ovState.myUserName
        });

        // 퍼블리셔 초기화
        const publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });

        // 세션에 퍼블리셔 추가
        await session.publish(publisher);

        // 상태 업데이트
        setOvState(prev => ({
          ...prev,
          session,
          mainStreamManager: publisher,
          publisher: publisher
        }));

      } catch (error) {
        console.error('세션 초기화 중 오류:', error);
        setConnectionError(error instanceof Error ? error.message : '알 수 없는 오류');
      }
    };

    initializeSession();

    // 컴포넌트 언마운트 시 세션 정리
    return () => {
      if (ovState.session) {
        ovState.session.disconnect();
      }
    };
  }, []);

  // 에러 발생 시 렌더링
  if (connectionError) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl text-red-500">Connection Error</h2>
        <p>{connectionError}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  // 세션 UI 렌더링
  return (
    <VideoSessionUI
      session={ovState.session}
      mySessionId={ovState.mySessionId}
      myUserName={ovState.myUserName}
      mainStreamManager={ovState.mainStreamManager}
      publisher={ovState.publisher}
      subscribers={ovState.subscribers}
      handleChangeSessionId={() => {}}
      handleChangeUserName={() => {}}
      joinSession={(e) => e.preventDefault()}
      leaveSession={() => navigate(-1)}
      switchCamera={() => {}}
      handleMainVideoStream={() => {}}
    />
  );
};

export default ActiveSessionPage;