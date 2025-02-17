import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PublicHeader from '@/components/organisms/PublicHeader/PublicHeader';
import DispatchNavBar from './DispatchNavBar/DispatchNavBar';
import GuardianNotificationDialog from './GuardianNotificationDialog';
import VideoCallDrawer from './VideoCall/VideoCallDrawer';
import { useDispatchAuthStore } from '@/store/dispatch/dispatchAuthStore.tsx';
import {useVideoDrawerStore} from "@/store/dispatch/dispatchVideoStore.tsx";
import {DispatchOrderResponse} from "@/types/dispatch/dispatchOrderResponse.types.ts";
import {useDispatchPatientStore} from "@/store/dispatch/dispatchPatientStore.tsx";
import { Alert, AlertTitle, AlertDescription } from '@components/ui/alert.tsx';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';

interface DispatchMainTemplateProps {
  children: React.ReactNode;
}

const DispatchMainTemplate = ({ children }: DispatchMainTemplateProps) => {
  const location = useLocation();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { isVideoDrawerOpen, setVideoDrawerOpen } = useVideoDrawerStore();  // 비디오 상태 전역으로 관리
  const {logout} = useDispatchAuthStore();
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
    }, 1000);
  }

  // SSE
  useEffect(() => {
    const dispatchLoginId = sessionStorage.getItem("userName");
    if (!dispatchLoginId) {
      console.log("구급팀 정보가 없습니다.");
      return;
    }

    let subscribeUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    if (subscribeUrl !== "http://localhost:8080") {
      subscribeUrl += "/api"
    }

    // SSE 연결
    const eventSource = new EventSource(`${subscribeUrl}/dispatchGroup/subscribe?clientId=${dispatchLoginId}`);
    console.log("SSE 연결 시도");

    eventSource.onopen = () => {
      console.log("SSE 연결 성공");
    };

    // 출동 지령 수신
    eventSource.addEventListener("dispatch-order", (event) => {
      const response: DispatchOrderResponse = JSON.parse(event.data);
      console.log(response);
      if (response.isSuccess) {
        handleAlertClose({
          title: "출동 지령 도착",
          description: `출동 지령이 도착했습니다. (신고 ID: ${response.data.call.callId})`,
          type: "default"
        });


        // 상황실에서 받은 정보 저장
        useDispatchPatientStore.getState().setPatientFromSSE(response.data);

        const openViduStore = useOpenViduStore.getState();
        console.log(openViduStore);

        openViduStore.handleChangeSessionId({
          target: { value: response.data.sessionId }
        } as React.ChangeEvent<HTMLInputElement>);


        openViduStore.joinSession();

        // drawer 열기
        setVideoDrawerOpen(true)

        // 환자 정보 작성페이지 열기
        navigate('/dispatch/patient-info')

      } else {
        handleAlertClose({
          title: "출동 지령 수신 실패",
          description: response.message || "출동 지령 수신에 실패했습니다",
          type: "destructive"
        });
      }
    });

    // 에러 처리
    eventSource.onerror = (error) => {
      console.error("SSE 연결 에러: ", error);
      eventSource.close();
    };

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      eventSource.close();
    };
  }, [navigate, setVideoDrawerOpen]); // 컴포넌트 마운트 시 한 번만 실행



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