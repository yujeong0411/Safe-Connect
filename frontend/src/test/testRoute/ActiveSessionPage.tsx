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

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // 세션 생성 및 토큰 획득
        const createdSessionId = await testStore.getState().createSession(ovState.mySessionId);
        const token = await testStore.getState().createToken(createdSessionId);

        // OpenVidu 초기화
        const OV = new OpenVidu();
        const session = OV.initSession();

        // 스트림 생성 이벤트 리스너
        session.on('streamCreated', (event) => {
          console.log('New stream created:', event);

          // 새로운 구독자(subscriber) 생성
          const subscriber = session.subscribe(event.stream, undefined);

          // 구독자 목록에 추가
          setOvState(prevState => ({
            ...prevState,
            subscribers: [...prevState.subscribers, subscriber]
          }));
        });

        // 스트림 제거 이벤트 리스너
        session.on('streamDestroyed', (event) => {
          console.log('Stream destroyed:', event);

          // 제거된 구독자 필터링
          setOvState(prevState => ({
            ...prevState,
            subscribers: prevState.subscribers.filter(
              sub => sub !== event.stream.streamManager
            )
          }));
        });

        // 세션 연결
        await session.connect(token, { clientData: userName });

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

        // 세션에 퍼블리셔 게시
        await session.publish(publisher);

        // 상태 업데이트
        setOvState(prevState => ({
          ...prevState,
          session,
          mainStreamManager: publisher,
          publisher: publisher
        }));

      } catch (error) {
        console.error('세션 초기화 중 오류:', error);
        // 오류 처리 로직 (예: 알림, 리다이렉트)
      }
    };

    initializeSession();

    // 컴포넌트 언마운트 시 세션 정리
    return () => {
      if (ovState.session) {
        ovState.session.disconnect();
      }
    };
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  const leaveSession = () => {
    if (ovState.session) {
      ovState.session.disconnect();
    }
    navigate('/test'); // 세션 나가기 후 이동할 페이지
  };

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
      leaveSession={leaveSession}
      switchCamera={() => {}}
      handleMainVideoStream={() => {}}
    />
  );
};

export default ActiveSessionPage;