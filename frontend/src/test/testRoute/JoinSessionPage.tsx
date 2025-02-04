import React, { useState } from 'react';
import { Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import { testStore } from '@/test/store/testAuthStore';
import VideoSessionUI from './VideoSessionUI';
import { OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';
import Button from '@components/atoms/Button/Button';
import Input from '@components/atoms/Input/Input';
import JoinSessionForm from '@/test/testRoute/JoinSessionForm.tsx';
import ActiveSessionPage from '@/test/testRoute/ActiveSessionPage.tsx';

const JoinSessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const [isJoined, setIsJoined] = useState(false);
  const [customUsername, setCustomUsername] = useState('');

  // 기본 사용자 이름 설정 (URL의 username 파라미터 or Guest + 랜덤 숫자)
  const defaultUsername = searchParams.get('username') ||
    `Guest${Math.floor(Math.random() * 1000)}`;

  const [ovState, setOvState] = useState({
    mySessionId: sessionId || 'DefaultSession',
    myUserName: defaultUsername,
    session: undefined as Session | undefined,
    mainStreamManager: undefined as StreamManager | undefined,
    publisher: undefined as Publisher | undefined,
    subscribers: [] as Subscriber[],
  });

  const OV = new OpenVidu();

  const handleJoinAsGuest = async () => {
    const userName = customUsername || defaultUsername;

    setOvState(prev => ({
      ...prev,
      myUserName: userName
    }));

    await joinSession(userName);
  };

  const joinSession = async (userName: string) => {
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

      setIsJoined(true);
    } catch (error) {
      console.error('세션 참여 실패:', error);
    }
  };

  const leaveSession = () => {
    if (ovState.session) {
      ovState.session.disconnect();
    }
    setOvState({
      mySessionId: sessionId || 'DefaultSession',
      myUserName: defaultUsername,
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
    });
    setIsJoined(false);
  };

  // 세션 입장 전 화면
  // const renderJoinScreen = () => (
  //   <div className="container mx-auto p-4">
  //     <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  //       <h2 className="text-2xl mb-4 text-center">
  //         Join Session: {ovState.mySessionId}
  //       </h2>
  //
  //       <div className="mb-4">
  //         <Input
  //           label="Custom Username (Optional)"
  //           type="text"
  //           value={customUsername}
  //           onChange={(e) => setCustomUsername(e.target.value)}
  //           placeholder={`Default: ${defaultUsername}`}
  //           width="full"
  //           variant="blue"
  //         />
  //       </div>
  //
  //       <div className="text-center">
  //         <Button
  //           variant="blue"
  //           width="full"
  //           onClick={handleJoinAsGuest}
  //         >
  //           Join as Guest
  //         </Button>
  //       </div>
  //     </div>
  //   </div>
  // );
  //
  // // 세션 입장 후 화면
  // if (isJoined) {
  //   return (
  //     <VideoSessionUI
  //       session={ovState.session}
  //       mySessionId={ovState.mySessionId}
  //       myUserName={ovState.myUserName}
  //       mainStreamManager={ovState.mainStreamManager}
  //       publisher={ovState.publisher}
  //       subscribers={ovState.subscribers}
  //       handleChangeSessionId={() => {}}
  //       handleChangeUserName={() => {}}
  //       joinSession={(e) => e.preventDefault()}
  //       leaveSession={leaveSession}
  //       switchCamera={() => {}}
  //       handleMainVideoStream={() => {}}
  //     />
  //   );
  // }

  // 기본 입장 화면
  return (
    <Routes>
      <Route
        path=""
        element={<JoinSessionForm sessionId={sessionId} />}
      />
      <Route
        path="room"
        element={<ActiveSessionPage sessionId={sessionId} />}
      />
    </Routes>
  );
};

export default JoinSessionPage;