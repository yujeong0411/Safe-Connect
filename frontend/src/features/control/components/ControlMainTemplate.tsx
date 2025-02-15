import React, { useEffect } from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader';
import NavBar from '@components/organisms/NavBar/NavBar';
import VideoCallDrawer from './VideoDrawer';
import { useVideoCallStore } from '@/store/control/videoCallStore';
import VideoCallCreateDialog from '@features/control/components/VideoCallCreateDialog';
import ProtectorNotifyDialog from '@features/control/components/ProtectorNotifyDialog';
import { useControlAuthStore } from '@/store/control/controlAuthStore.tsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useControlsseStore } from '@/store/control/controlsseStore.ts';

interface ControlTemplateProps {
  children?: React.ReactNode;
}

const ControlTemplate = ({ children }: ControlTemplateProps) => {
  const { setIsOpen, isOpen: isDrawerOpen } = useVideoCallStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = React.useState(false);
  const { logout } = useControlAuthStore();
  const { connect, disconnect } = useControlsseStore();
  const { isAuthenticated } = useControlAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      disconnect();
      navigate('/control');
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      const userName = sessionStorage.getItem("userName");
      if (userName && isAuthenticated && location.pathname.startsWith('/control')) {
        connect(userName);

        // 25분 후 자동 재연결 설정
        reconnectTimer = setTimeout(() => {
          disconnect();
          connect(userName);
        }, 25 * 60 * 1000); // 25분
      }
    };

    // 초기 연결
    connectSSE();

    const handleOnline = () => {
      if (location.pathname.startsWith('/control')) {
        console.log("Browser is online, reconnecting SSE...");
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
        }
        disconnect();
        connectSSE();
      }
    };

    // 브라우저 종료 시 처리 추가
    const handleBeforeUnload = () => {
      disconnect();
    };

    window.addEventListener('online', handleOnline);

    // Cleanup function
    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      // /control 경로를 벗어날 때만 연결 해제
      if (!location.pathname.startsWith('/control')) {
        disconnect();
      }

      window.removeEventListener('online', handleOnline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [connect, disconnect, isAuthenticated, location.pathname]);

  const navItems = [
    {
      label: '영상통화 생성',
      path: '#',
      hasModal: true,
      onModalOpen: () => setIsVideoModalOpen(true),
    },
    { label: '전화 업무', path: '#', hasModal: true, onModalOpen: () => setIsOpen(!isDrawerOpen) },
    { label: '신고 업무', path: '/control/patient-info' },
    { label: '출동 지령', path: '/control/dispatch-order' },
    {
      label: '보호자 알림',
      path: '#',
      hasModal: true,
      onModalOpen: () => setIsNotifyModalOpen(true),
    },
    { label: '신고 내역', path: '/control/main' },
  ];

  return (
    <div className="mih-h-screen bg-bg flex flex-col">
      <div className="-space-y-4">
        <PublicHeader
          labels={[
            {
              label: '로그아웃',
              href: '#',
              onClick: handleLogout,
            },
          ]}
        />
        <NavBar navItems={navItems} />
      </div>
      <div className="flex-1 min-h-[calc(100vh-100px)]">
        <VideoCallDrawer>{children}</VideoCallDrawer>
      </div>
      <VideoCallCreateDialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen} />
      <ProtectorNotifyDialog open={isNotifyModalOpen} onOpenChange={setIsNotifyModalOpen} />
    </div>
  );
};

export default ControlTemplate;