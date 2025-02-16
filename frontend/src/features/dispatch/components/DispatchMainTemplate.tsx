import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PublicHeader from '@/components/organisms/PublicHeader/PublicHeader';
import DispatchNavBar from './DispatchNavBar/DispatchNavBar';
import GuardianNotificationDialog from './GuardianNotificationDialog';
import VideoCallDrawer from './VideoCall/VideoCallDrawer';
import { useDispatchAuthStore } from '@/store/dispatch/dispatchAuthStore.tsx';
import {useVideoDrawerStore} from "@/store/dispatch/dispatchVideoStore.tsx";
import {useDispatchPatientStore} from "@/store/dispatch/dispatchPatientStore.tsx";
import { Alert, AlertTitle, AlertDescription } from '@components/ui/alert.tsx';
import { useDispatchSseStore } from '@/store/dispatch/dispatchSseStore';


interface DispatchMainTemplateProps {
  children: React.ReactNode;
}

const DispatchMainTemplate = ({ children }: DispatchMainTemplateProps) => {
  const location = useLocation();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { isVideoDrawerOpen, setVideoDrawerOpen } = useVideoDrawerStore();  // 비디오 상태 전역으로 관리
  const {logout} = useDispatchAuthStore();
  const { connect, disconnect, startReconnectTimer, resetNotificationStatus } = useDispatchSseStore();
  const { isAuthenticated } = useDispatchAuthStore();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    description: "",
    type: "default" as "default" | "destructive",
  });


  // 알림 처리 함수
  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 10000);
  }


  // 출동 지령 데이터
  const patientData = useDispatchPatientStore((state) => state.formData);
  const currentCallId = useDispatchSseStore((state) => state.currentCallId);
  console.log("currentCallId = ", currentCallId);
  const hasNotificationBeenShown = useDispatchSseStore((state) => state.hasNotificationBeenShown);

  // 수락한 병원 데이터
  // const acceptedHospital = useDispatchSseStore((state) => state.acceptedHospital);

  // SSE 연결
  useEffect(() => {
    // SSE 연결 함수
    const connectSSE = () => {
      const userName = sessionStorage.getItem("userName");
      if (userName && isAuthenticated && location.pathname.startsWith("/dispatch")) {
        connect(userName); // 이때, 핸들러 자동 등록됨
        startReconnectTimer();
      }

      // 브라우저가 온라인 상태로 돌아올 때 연결 다시 시도하는 함수
      const handleOnline = () => {
        if (location.pathname.startsWith("/dispatchGroup")) {
          console.log("Browser is online, reconnecting SSE..");
          disconnect();
          connectSSE();
        }
      };

      // 브라우저 종료 || 새로고침 전에 연결 끊는 함수
      const handleBeforeUnload = () => {
        disconnect();
      }

      window.addEventListener("online", handleOnline);
      window.addEventListener("beforeunload", handleBeforeUnload);

      // clean up
      return () => {

        // 구급팀 경로를 벗어나면 연결 해제
        if (!location.pathname.startsWith("/dispatchGroup")) {
          disconnect();
        }

        // 이벤트 리스너 제거
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
        console.log("Condition satisfied, showing alert");
        handleAlertClose({
          title: "출동 지령 도착",
          description: "출동 지령이 도착했습니다.",
          type: "default"
        });

        // dispatchSseStore로 코드 이동
        // const openViduStore = useOpenViduStore.getState();
        // openViduStore.handleChangeSessionId({
        //   target: { value: response.data.sessionId }
        // } as React.ChangeEvent<HTMLInputElement>);

        // openViduStore.joinSession();

        // drawer 열기
        setVideoDrawerOpen(true)

        // 환자 정보 작성페이지 열기
        navigate('/dispatch/patient-info')

        useDispatchSseStore.getState().setNotificationShown(currentCallId);
      }
    } catch (error) {
        handleAlertClose({
          title: "출동 지령 수신 실패",
          description: "출동 지령 수신에 실패했습니다",
          type: "destructive"
        })
      }
    }, [patientData.patientId, currentCallId, hasNotificationBeenShown, navigate, setVideoDrawerOpen]);


    // // 이송 수락
    // useEffect(() => {
    //   try {
    //     if (acceptedHospital) {
    //       handleAlertClose({
    //         title: "환자 이송 요청 수락",
    //         description: `이송 병원: ${acceptedHospital.hospitalName}`,
    //         type: "default"
    //       })
    //     }
    //   } catch (error) {
    //     handleAlertClose({
    //       title: "이송 수락 병원 데이터 수신 실패",
    //       description: "이송을 수락한 병원의 데이터 가져오기에 실패했습니다.",
    //       type: "destructive"
    //   });
    //   }
    // }, [acceptedHospital]);

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
      label: '출동 현황',
      path: '/dispatch/main',
      active: location.pathname === '/dispatch/main'
    },
    {
      label: '출동 업무',
      path: '/dispatch/patient-info',
      active: location.pathname === '/dispatch/patient-info'
    },
    {
      label: '이송 업무',
      path: '/dispatch/transfer-request',
      active: location.pathname === '/dispatch/transfer-request'
    },
    {
      label: '전화 업무',
      path: '#',
      hasModal: true,
      onModalOpen: () => setVideoDrawerOpen(!isVideoDrawerOpen)
    },
    {
      label: '보호자 메세지',
      path: '#',
      hasModal: true,
      onModalOpen: () => setShowNotificationModal(true)
    }
  ];

  return (
    <div className="h-screen bg-bg flex flex-col">
      {/* Alert UI */}
      {showAlert && (
          <div className="fixed left-1/2 top-80 -translate-x-1/2 z-[999]">
            <Alert
                variant={alertConfig.type}
                className={`w-[400px] shadow-lg bg-white ${
                    alertConfig.type === 'default'
                        ? '[&>svg]:text-blue-600 text-blue-600'
                        : '[&>svg]:text-red-500 text-red-500'
                }`}
            >
              <AlertTitle className="text-xl ml-2">{alertConfig.title}</AlertTitle>
              <AlertDescription className="text-base m-2">
                {alertConfig.description}
              </AlertDescription>
            </Alert>
          </div>
      )}


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
      <div className={`transition-all duration-300 ${isVideoDrawerOpen ? 'ml-[50%] w-[50%]' : 'w-full'}`}>
          {children}
        </div>
        <VideoCallDrawer 
          isOpen={isVideoDrawerOpen}
          onClose={() => setVideoDrawerOpen(false)}
        />

        {/*수정 필요*/}
        <GuardianNotificationDialog
          open={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
        />
      </div>
    </div>
  );
};

export default DispatchMainTemplate;