import React, {useEffect, useState} from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader';
import NavBar from '@components/organisms/NavBar/NavBar';
import VideoCallDrawer from './VideoDrawer';
import { useVideoCallStore } from '@/store/control/videoCallStore';
import VideoCallCreateDialog from '@features/control/components/VideoCallCreateDialog';
import { useControlAuthStore } from '@/store/control/controlAuthStore.tsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useControlsseStore } from '@/store/control/controlsseStore.ts';
import {Alert, AlertDescription, AlertTitle} from "@components/ui/alert.tsx";
import {CircleAlert, CircleCheckBig} from "lucide-react";
import Footer from "@components/organisms/Footer/Footer";
import useKakaoLoader from '@/hooks/useKakaoLoader.ts';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore';

interface ControlTemplateProps {
  children?: React.ReactNode;
}

const ControlTemplate = ({ children }: ControlTemplateProps) => {
  const isKakaoLoaded = useKakaoLoader(); // Kakao Maps API 로드
  const { setIsOpen, isOpen: isDrawerOpen } = useVideoCallStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const { logout } = useControlAuthStore();
  const { connect, disconnect } = useControlsseStore();
  const { isAuthenticated } = useControlAuthStore();
  const { isActive } = useOpenViduStore();
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive',
  });

  const handleCallerConnection = (): void => {
    if (!isActive) {
      setIsVideoModalOpen(true);
    } else {
      setIsOpen(!isDrawerOpen);
    }
  };


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
      label: "신고자 연결",
      path: "#",
      hasModal: true,
      onModalOpen: handleCallerConnection,
    },
    { label: '신고 접수', path: '/control/patient-info' },
    { label: '출동 지령', path: '/control/dispatch-order' },
    { label: '신고 내역', path: '/control/main' },
  ];

  return (
    <div className="mih-h-screen bg-bg flex flex-col">
      {isKakaoLoaded ? (
        <>
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
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p>지도를 불러오는 중입니다...</p>
        </div>
      )}
      <VideoCallCreateDialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen} />

      {showAlert && (
          <div className="fixed left-1/2 top-80 -translate-x-1/2 z-[999]">
            <Alert
                variant={alertConfig.type}
                className="w-[400px] shadow-lg bg-white"
            >
              {alertConfig.type === 'default' ? (
                  <CircleCheckBig className="h-6 w-6" />
              ) : (
                  <CircleAlert className="h-6 w-6" />
              )}
              <AlertTitle className="text-lg ml-2">{alertConfig.title}</AlertTitle>
              <AlertDescription className="text-base m-2">{alertConfig.description}</AlertDescription>
            </Alert>
          </div>
      )}
      <Footer />
    </div>
  );
};

export default ControlTemplate;