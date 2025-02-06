import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import { useEffect, useMemo, useState } from 'react';
import UserVideoComponent from '@features/openvidu/component/UserVideoComponent.tsx';

const VideoSessionUI: React.FC = () => {
  const {
    session,
    sessionId,
    localUser,
    subscribers,
    joinSession
  } = useOpenViduStore();

  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      try {
        if (sessionId && !session) {
          await joinSession();
          if (isMounted) {
            // 약간의 지연 후 준비 상태 설정
            setTimeout(() => {
              setIsSessionReady(true);
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        if (isMounted) {
          setIsSessionReady(false);
        }
      }
    };

    initializeSession();

    return () => {
      isMounted = false;
      setIsSessionReady(false);
    };
  }, [sessionId, joinSession]); // session 제거하고 joinSession 추가

  // 다른 참가자들 필터링
  const otherParticipants = useMemo(() => {
    if (!isSessionReady || !session) return [];

    return subscribers.filter(subscriber => {
      if (!localUser?.streamManager) return true;
      return subscriber.stream.connection.connectionId !== localUser.streamManager.stream.connection.connectionId;
    });
  }, [subscribers, localUser, isSessionReady, session]);

  // 메인 스트림
  const mainStream = otherParticipants.length > 0 ? otherParticipants[0] : null;

  // 세션이 준비되지 않았거나 초기화 중일 때
  if (!isSessionReady || !session) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">연결 중...</span>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full relative">
      {/* 메인 스트림 */}
      <div className="w-full h-full">
        {mainStream ? (
          <UserVideoComponent
            streamManager={mainStream}
            key={mainStream.stream.streamId}
          />
        ) : (
          <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">대기 중...</span>
          </div>
        )}
      </div>

      {/* 로컬 사용자 */}
      {isSessionReady && localUser?.streamManager && (
        <div className="absolute bottom-4 right-4 w-1/4 aspect-video">
          <UserVideoComponent
            streamManager={localUser.streamManager}
            key={localUser.streamManager.stream.streamId}
          />
        </div>
      )}
    </div>
  );
};

export default VideoSessionUI;