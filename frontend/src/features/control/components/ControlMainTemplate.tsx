import React, { useEffect } from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader';
import NavBar from '@components/organisms/NavBar/NavBar';
import VideoCallDrawer from './VideoDrawer';
import { useVideoCallStore } from '@/store/control/videoCallStore';
import VideoCallCreateDialog from '@features/control/components/VideoCallCreateDialog';
import ProtectorNotifyDialog from '@features/control/components/ProtectorNotifyDialog';
import { useControlAuthStore } from '@/store/control/controlAuthStore.tsx';
import { useNavigate } from 'react-router-dom';
import { useControlsseStore } from '@/store/control/controlsseStore.ts';

interface ControlTemplateProps {
  children?: React.ReactNode;
}

const ControlTemplate = ({ children }: ControlTemplateProps) => {
  const { setIsOpen, isOpen: isDrawerOpen } = useVideoCallStore();
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = React.useState(false);
  const { logout } = useControlAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      disconnect()
      navigate('/control');
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };
  const { connect,disconnect } = useControlsseStore();
  const { isAuthenticated } = useControlAuthStore(); // 인증 상태 확인

  useEffect(() => {
    const connectSSE = () => {
      const userName = sessionStorage.getItem("userName");
      if (userName && isAuthenticated) {
        connect(userName);
      }
    };
    const handleBeforeUnload = () => {
      disconnect();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    connectSSE(); // 초기 연결

    // 주기적으로 연결 상태 확인 및 재연결
    const intervalId = setInterval(() => {
      connectSSE();
    }, 30000); // 30초마다 연결 상태 확인

    const handleOnline = () => {
      console.log("Browser is online, reconnecting SSE...");
      connectSSE();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(intervalId);
      disconnect();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [connect,disconnect, isAuthenticated]);


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
