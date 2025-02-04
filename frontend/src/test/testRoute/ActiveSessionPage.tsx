import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { testStore } from '@/test/store/testAuthStore';
import VideoSessionUI from './VideoSessionUI';
import { OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';

interface ActiveSessionPageProps {
  sessionId?: string;
}

const ActiveSessionPage: React.FC<ActiveSessionPageProps> = ({ sessionId }) => {
  const [searchParams] = useSearchParams();
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

  const OV = new OpenVidu();

  useEffect(() => {
    const initializeSession = async () => {
      const session = OV.initSession();

      session.on('streamCreated', (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        setOvState(prev => ({
          ...prev,
          subscribers: [...prev.subscribers, subscriber]
        }));
      });

      session.on('streamDestroyed', (event) => {
        const deletedSubscriber = event.stream.streamManager;
        setOvState(prev => ({
          ...prev,
          subscribers: prev.subscribers.filter(sub => sub !== deletedSubscriber)
        }));
      });

      try {
        const token = await testStore.getState().createToken(ovState.mySessionId);
        await session.connect(token, { clientData: userName });

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

        await session.publish(publisher);

        setOvState(prev => ({
          ...prev,
          session,
          mainStreamManager: publisher,
          publisher: publisher
        }));
      } catch (error) {
        console.error('세션 참여 실패:', error);
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

  const leaveSession = () => {
    // 세션 나가기 로직 (필요에 따라 홈이나 세션 목록 페이지로 이동)
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