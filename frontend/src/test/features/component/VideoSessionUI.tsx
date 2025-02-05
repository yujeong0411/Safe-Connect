import React, { useEffect, useMemo } from 'react';
import UserVideoComponent from './UserVideoComponent';
import { useOpenViduStore } from '@/test/store/OpenViduStore';
import { StreamManager } from 'openvidu-browser';

const VideoSessionUI: React.FC = () => {
  const {
    session,
    sessionId,
    localUser,
    publisher,
    subscribers,
    joinSession
  } = useOpenViduStore();

  useEffect(() => {
    const initializeSession = async () => {
      if (!session && sessionId) {
        try {
          await joinSession();
        } catch (error) {
          console.error('Failed to initialize session:', error);
        }
      }
    };

    initializeSession();
  }, [session, sessionId]);

  // 다른 참가자들 (로컬 사용자 제외)
  const otherParticipants = useMemo(() => {
    return subscribers.filter(
      (subscriber) =>
        localUser &&
        subscriber.stream.connection.connectionId !== localUser.connectionId
    );
  }, [subscribers, localUser]);

  // 메인 스트림 (다른 참가자 중 첫 번째, 없으면 null)
  const mainStream = otherParticipants.length > 0
    ? otherParticipants[0]
    : null;

  return (
    <div className="flex w-full h-screen">
      {/* 메인 스트림 (왼쪽) */}
      <div className="w-3/4 h-full">
        {mainStream && (
          <UserVideoComponent
            streamManager={mainStream}
            key={mainStream.stream.streamId}
          />
        )}
      </div>

      {/* 로컬 사용자 (오른쪽 하단) */}
      {localUser && localUser.streamManager && (
        <div className="absolute bottom-4 right-4 w-1/6 aspect-video">
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