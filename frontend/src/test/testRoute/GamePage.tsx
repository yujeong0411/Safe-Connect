import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OpenVidu, Session, StreamManager, Publisher, Subscriber } from 'openvidu-browser';
import UserVideo from './UserVideo';

interface LocationState {
  roomId: string;
  sessionId: string;
  token: string;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, sessionId, token } = location.state as LocationState;

  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [mainStreamManager, setMainStreamManager] = useState<StreamManager | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const initOpenViduSession = async () => {
    try {
      console.log('세션 초기화 시작:', { roomId, sessionId, token });

      const ov = new OpenVidu();
      const mySession = ov.initSession();

      // 세션 연결 (메타데이터 간소화)
      await mySession.connect(token, {
        platform: 'Web',
        sdkVersion: '2.31.0'
      });

      console.log('세션 연결 성공');

      // 게시자 초기화
      const publisherInstance = await ov.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 60,
        insertMode: 'APPEND',
        mirror: true
      });

      console.log('게시자 초기화 완료');

      // 스트림 게시
      await mySession.publish(publisherInstance);

      console.log('스트림 게시 성공');

      // 상태 업데이트
      setOV(ov);
      setSession(mySession);
      setPublisher(publisherInstance);
      setMainStreamManager(publisherInstance);

    } catch (error) {
      console.error('세션 초기화 중 오류:', error);
      navigate('/test');
    }
  };

  // 세션 나가기
  const leaveSession = () => {
    console.log('세션 나가기');
    if (session) {
      session.disconnect();
      navigate('/test'); // 홈으로 리다이렉트
    }
  };

  // 참가자 전환
  const switchMainStream = () => {
    if (subscribers.length > 0) {
      const currentIndex = subscribers.indexOf(mainStreamManager as Subscriber);
      const nextIndex = (currentIndex + 1) % subscribers.length;
      setMainStreamManager(subscribers[nextIndex]);
    }
  };

  // 세션 초기화
  useEffect(() => {
    // 유효성 검사
    if (!roomId || !token) {
      console.error('잘못된 세션 정보');
      navigate('/test'); // 잘못된 접근 시 홈으로
      return;
    }

    // 세션 초기화
    initOpenViduSession();

    // 컴포넌트 언마운트 시 세션 나가기
    return () => {
      leaveSession();
    };
  }, []);

  return (
    <div className="h-screen bg-black relative">
      {/* 메인 비디오 스트림 */}
      {mainStreamManager && (
        <div className="h-full relative">
          <UserVideo
            streamManager={mainStreamManager}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 내 비디오 */}
      {publisher && (
        <div className="absolute bottom-4 right-4 w-1/4 h-1/4 z-10">
          <UserVideo
            streamManager={publisher}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 참가자 전환 버튼 */}
      {subscribers.length > 1 && (
        <button
          onClick={switchMainStream}
          className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-20"
        >
          참가자 전환 ({subscribers.length})
        </button>
      )}

      {/* 세션 나가기 버튼 */}
      <button
        onClick={leaveSession}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        방 나가기
      </button>
    </div>
  );
};

export default GamePage;