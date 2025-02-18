import React, {useEffect, useState} from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader';
import NavBar from '@components/organisms/NavBar/NavBar';
import VideoCallDrawer from './VideoDrawer';
import { useVideoCallStore } from '@/store/control/videoCallStore';
import VideoCallCreateDialog from '@features/control/components/VideoCallCreateDialog';
import ProtectorNotifyDialog from '@features/control/components/ProtectorNotifyDialog';
import { useControlAuthStore } from '@/store/control/controlAuthStore.tsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useControlsseStore } from '@/store/control/controlsseStore.ts';
import {usePatientStore} from "@/store/control/patientStore.tsx";
import {Alert, AlertDescription, AlertTitle} from "@components/ui/alert.tsx";
import {CircleAlert, CircleCheckBig} from "lucide-react";
import Footer from "@components/organisms/Footer/Footer";
import useKakaoLoader from '@/hooks/useKakaoLoader.ts';

interface ControlTemplateProps {
  children?: React.ReactNode;
}

const ControlTemplate = ({ children }: ControlTemplateProps) => {
  const isKakaoLoaded = useKakaoLoader(); // Kakao Maps API 로드
  const { setIsOpen, isOpen: isDrawerOpen } = useVideoCallStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = React.useState(false);
  const { logout } = useControlAuthStore();
  const { connect, disconnect } = useControlsseStore();
  const { isAuthenticated } = useControlAuthStore();
  const { patientInfo, currentCall } = usePatientStore();
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive',
  });

  // 알림창 표시 핸들러
  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  const handleProtectorNotify = () => {
    if (!currentCall?.userId || !patientInfo?.userProtectorPhone) {
      // 회원이 아니거나 보호자 번호가 없는 경우 알림 표시
      // alert('등록된 보호자가 없거나 회원이 아닙니다.');
      handleAlertClose({
        title: '메세지 전송 불가',
        description: '등록된 보호자가 없거나 회원이 아닙니다.',
        type: 'destructive',
      });
      return;
    }
    setIsNotifyModalOpen(true);
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
      onModalOpen: handleProtectorNotify,   // 유저이고 보호자번호가 있는 경우만 열림
      disabled: !currentCall?.userId || !patientInfo?.userProtectorPhone  // 비활성화
    },
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
      <ProtectorNotifyDialog open={isNotifyModalOpen} onOpenChange={setIsNotifyModalOpen} />

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