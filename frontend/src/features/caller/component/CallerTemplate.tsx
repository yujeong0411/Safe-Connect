// CallerTemplate.tsx
import React, { useEffect } from 'react';
import NavBar from '@components/organisms/NavBar/NavBar';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import CallerMapDialog from '@features/caller/component/CallerMapDialog.tsx';
import CallerVideoSessionUI from '@features/caller/component/CallerVideoSessionUI.tsx';
import { useNavigate } from 'react-router-dom';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import { useLocationStore } from '@/store/location/locationStore.tsx';

const CallerTemplate = () => {
  const [isMapModalOpen, setIsMapModalOpen] = React.useState(false);
  const navigate = useNavigate();
  const { session, sessionId, joinSession, leaveSession } = useOpenViduStore();
  const { setLocation,sendUserLocation } = useLocationStore();

  // 위치 정보 가져오기
  const getLocationPermission = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        setLocation(position.coords.latitude, position.coords.longitude);
        await sendUserLocation(position.coords.latitude, position.coords.longitude,sessionId);

        return true;
      } catch (error) {
        console.error('위치 정보 획득 실패:', error);
        setLocation(37.566826, 126.9786567); // 서울시청 좌표 (기본값)
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      if (!sessionId) {
        navigate('/caller/error');
        return;
      }

      if (!session && mounted) {
        try {
          // 카메라/마이크 권한과 함께 위치 권한도 요청
          await Promise.all([
            joinSession(),
            getLocationPermission()
          ]);
        } catch (error) {
          console.error('Failed to initialize session or get location:', error);
          if (mounted) {
            navigate('/caller/error');
          }
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
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

  const handleSessionOut = async () => {
    try {
      await leaveSession();
      navigate('/caller/end');
    } catch (error) {
      console.error('세션 종료 실패', error);
    }
  };

  return (
    <div className="mih-h-screen bg-bg flex flex-col">
      <PublicHeader
        labels={[
          {
            label: 'x',
            href: '#',
            onClick: handleSessionOut,
          },
        ]}
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