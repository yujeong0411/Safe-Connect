import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoSessionUI from '@features/openvidu/component/VideoSessionUI.tsx';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';

const ActiveSessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, sessionId, joinSession, leaveSession } = useOpenViduStore();

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      if (!sessionId) {
        navigate('/openvidu/create');
        return;
      }

      if (!session && mounted) {
        try {
          await joinSession();
        } catch (error) {
          console.error('Failed to initialize session:', error);
          if (mounted) {
            navigate('/openvidu/create');
          }
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
      // 페이지를 완전히 벗어날 때만 세션을 종료
      if (window.location.pathname.indexOf('/OpenviduPage') === -1) {
        leaveSession();
      }
    };
  }, [session, sessionId, joinSession, leaveSession, navigate]);

  if (!sessionId) {
    return null;
  }

  return <VideoSessionUI />;
};

export default ActiveSessionPage;