import React, { useEffect } from 'react';
import NavBar from '@components/organisms/NavBar/NavBar';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import CallerMapDialog from '@features/caller/component/CallerMapDialog.tsx';
import CallerVideoSessionUI from '@features/caller/component/CallerVideoSessionUI.tsx';
import { useNavigate } from 'react-router-dom';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';

const CallerTemplate = () => {
  const [isMapModalOpen, setIsMapModalOpen] = React.useState(false);
  const navigate = useNavigate();
  const { session, sessionId, joinSession, leaveSession } = useOpenViduStore();

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      if (!sessionId) {
        navigate('/caller/error');
        return;
      }

      if (!session && mounted) {
        try {
          await joinSession();
        } catch (error) {
          console.error('Failed to initialize session:', error);
          if (mounted) {
            navigate('/caller/error');
          }
        }
      }
    };
    initSession();

    return () => {
      mounted = false;
      // 페이지를 완전히 벗어날 때만 세션을 종료
      if (session) {
        leaveSession();
      }
    };
  }, [session, sessionId, joinSession, leaveSession, navigate]);

  if (!sessionId) {
    return null;
  }

  const navItems = [
    {
      label: '영상통화',
      hasModal: false,
      path : '/caller',
    },
    {
      label: '지도',
      path: '#',
      hasModal: true,
      onModalOpen: () => setIsMapModalOpen(true),
    }
  ];

  return (
    <div className="mih-h-screen bg-bg flex flex-col">
      <PublicHeader
        labels={[]}
      />
      <div className="-space-y-4">
        <NavBar navItems={navItems} />
      </div>
      <div className="flex-1 min-h-[calc(100vh-100px)]">
        <CallerVideoSessionUI />
      </div>
      <CallerMapDialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen} />
    </div>
  );
};


export default CallerTemplate;
