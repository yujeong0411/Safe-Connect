import React, { useEffect } from 'react';
import UserVideoComponent from './UserVideoComponent';
import { useOpenViduStore } from '@/test/store/OpenViduStore';

const VideoSessionUI: React.FC = () => {
  const {
    session,
    sessionId,
    mainStreamManager,
    publisher,
    subscribers,
    joinSession,
    handleMainVideoStream
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mainStreamManager && (
        <div className="main-video-container w-full aspect-video">
          <UserVideoComponent
            streamManager={mainStreamManager}
            key={mainStreamManager.stream.streamId}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {publisher && (
          <div
            className="stream-container w-full aspect-video cursor-pointer"
            onClick={() => handleMainVideoStream(publisher)}
          >
            <UserVideoComponent
              streamManager={publisher}
              key={publisher.stream.streamId}
            />
          </div>
        )}

        {subscribers.map((sub) => (
          <div
            key={sub.stream.streamId}
            className="stream-container w-full aspect-video cursor-pointer"
            onClick={() => handleMainVideoStream(sub)}
          >
            <UserVideoComponent streamManager={sub} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSessionUI;