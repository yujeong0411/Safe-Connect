// CallerTemplate.tsx
import React, { useEffect } from 'react';
import NavBar from '@components/organisms/NavBar/NavBar';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import CallerMapDialog from '@features/caller/component/CallerMapDialog.tsx';
import { useNavigate } from 'react-router-dom';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import { useLocationStore } from '@/store/location/locationStore.tsx';

const CallerErrorTemplate = () => {
  const [isMapModalOpen, setIsMapModalOpen] = React.useState(true);
  const navigate = useNavigate();
  const {sessionId} = useOpenViduStore();
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
    getLocationPermission();
  }, []);

  const navItems = [
    {
      label: '지도',
      path: '#',
      hasModal: true,
      onModalOpen: () => setIsMapModalOpen(true),
    }
  ];

  const handleSessionOut = async () => {
    try {
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
      <CallerMapDialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen} />
    </div>
  );
};

export default CallerErrorTemplate;