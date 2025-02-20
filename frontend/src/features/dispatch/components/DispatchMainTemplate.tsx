import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PublicHeader from '@/components/organisms/PublicHeader/PublicHeader';
import DispatchNavBar from './DispatchNavBar/DispatchNavBar';
import GuardianNotificationDialog from './GuardianNotificationDialog';
import VideoCallDrawer from './VideoCall/VideoCallDrawer';
import DispatchNotificationDialog from '@/features/dispatch/components/TransferDialog/DispatchNotificationDialog.tsx';
import { useDispatchAuthStore } from '@/store/dispatch/dispatchAuthStore.tsx';
import {useVideoDrawerStore} from "@/store/dispatch/dispatchVideoStore.tsx";
import {useDispatchPatientStore} from "@/store/dispatch/dispatchPatientStore.tsx";
import { Alert, AlertTitle, AlertDescription } from '@components/ui/alert.tsx';
import { useDispatchSseStore } from '@/store/dispatch/dispatchSseStore';
import { dispatchDepartAt } from '@features/dispatch/sevices/dispatchServiece.ts';
import { useLocationTracking } from '@features/dispatch/hooks/locationTracking.ts';
import {useOpenViduStore} from "@/store/openvidu/OpenViduStore.tsx";
import Footer from '@/components/organisms/Footer/Footer';

interface DispatchMainTemplateProps {
  children: React.ReactNode;
}

const DispatchMainTemplate = ({ children }: DispatchMainTemplateProps) => {
  const location = useLocation();
  const {sessionId} = useOpenViduStore();  // 전달받은 세션id 가져오기
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showDispatchDialog, setShowDispatchDialog] = useState(false);
  const { isVideoDrawerOpen, setVideoDrawerOpen } = useVideoDrawerStore();
  const {logout} = useDispatchAuthStore();
  const { connect, disconnect, startReconnectTimer } = useDispatchSseStore();
  const { isAuthenticated } = useDispatchAuthStore();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const {formData} = useDispatchPatientStore()
  useLocationTracking();
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    description: "",
    type: "default" as "default" | "destructive",
  });

  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  }

  const patientData = useDispatchPatientStore((state) => state.formData);
  const currentCallId = useDispatchSseStore((state) => state.currentCallId);
  const hasNotificationBeenShown = useDispatchSseStore((state) => state.hasNotificationBeenShown);

  // SSE 연결
  useEffect(() => {
    const connectSSE = () => {
      const userName = sessionStorage.getItem("userName");
      if (userName && isAuthenticated && location.pathname.startsWith("/dispatch")) {
        connect(userName);
        startReconnectTimer();
      }

      const handleOnline = () => {
        if (location.pathname.startsWith("/dispatch")) {
          disconnect();
          connectSSE();
        }
      };

      const handleBeforeUnload = () => {
        disconnect();
      }

      window.addEventListener("online", handleOnline);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        if (!location.pathname.startsWith("/dispatch")) {
          disconnect();
        }
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    };
    connectSSE();
  }, [connect, disconnect, isAuthenticated, location.pathname]);

  // 출동 지령
  useEffect(() => {
    try {
      if (patientData.patientId && currentCallId !== null && !hasNotificationBeenShown(currentCallId)) {
        setShowDispatchDialog(true);
        useDispatchSseStore.getState().setNotificationShown(currentCallId);
      }
    } catch (error) {
      handleAlertClose({
        title: "출동 지령 수신 실패",
        description: "출동 지령 수신에 실패했습니다",
        type: "destructive"
      });
    }
  }, [patientData.patientId, currentCallId, hasNotificationBeenShown]);

  const handleVideoCall =  () => {
    if(formData.dispatchId){
      dispatchDepartAt(formData.dispatchId)
    }
    navigate('/dispatch/patient-info');
    setVideoDrawerOpen(true);
    setShowDispatchDialog(false);
  };

  const handlePatientInfo = () => {
    if(formData.dispatchId){
      dispatchDepartAt(formData.dispatchId)
    }
    navigate('/dispatch/patient-info');
    setShowDispatchDialog(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/dispatch');
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  const navItems = [
    {
      label: '영상 통화',
      path: '#',
      hasModal: true,
      disabled: !sessionId,
      onModalOpen: () => sessionId && setVideoDrawerOpen(!isVideoDrawerOpen)  // 세션 아이디가 있어야 열림
    },
    {
      label: '환자 정보 작성',
      path: '/dispatch/patient-info',
      active: location.pathname === '/dispatch/patient-info'
    },
    {
      label: '이송 요청',
      path: '/dispatch/transfer-request',
      active: location.pathname === '/dispatch/transfer-request'
    },
    {
      label: '상황 종료',
      path: '#',
      hasModal: true,
      onModalOpen: () => setShowNotificationModal(true)
    },
    {
      label: '출동 내역',
      path: '/dispatch/main',
      active: location.pathname === '/dispatch/main'
    },
  ];

  return (
      <div className="min-h-screen bg-bg flex flex-col">
        {showAlert && (
            <div className="fixed left-1/2 top-80 -translate-x-1/2 z-[999]">
              <Alert
                  variant={alertConfig.type}
                  className="w-[90%] md:w-[400px] shadow-lg bg-white mx-auto"
              >
                <AlertTitle className="text-lg md:text-xl ml-2">{alertConfig.title}</AlertTitle>
                <AlertDescription className="text-sm md:text-base m-2">
                  {alertConfig.description}
                </AlertDescription>
              </Alert>
            </div>
        )}

        <DispatchNotificationDialog
            open={showDispatchDialog}
            onOpenChange={setShowDispatchDialog}
            onVideoCall={handleVideoCall}
            onPatientInfo={handlePatientInfo}
        />

        <div className="-space-y-2">
          <PublicHeader
              labels={[
                {
                  label: '로그아웃',
                  href: '#',
                  onClick: handleLogout,
                },
              ]}
          />
          <DispatchNavBar navItems={navItems} />
        </div>
        <div className="flex-1">
          <div className={`transition-all duration-300 ${
              isVideoDrawerOpen
                  ? 'md:ml-[50%] md:w-[50%] w-full'
                  : 'w-full'
          }`}>
            {children}
          </div>
          <VideoCallDrawer
              isOpen={isVideoDrawerOpen}
              onClose={() => setVideoDrawerOpen(false)}
          />
          <GuardianNotificationDialog
              open={showNotificationModal}
              onClose={() => setShowNotificationModal(false)}
          />
        </div>
        <Footer />
      </div>
  );
};

export default DispatchMainTemplate;