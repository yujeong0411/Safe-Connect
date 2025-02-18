import { useEffect } from 'react';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore';
import { dispatchLocation } from '@/features/dispatch/sevices/dispatchServiece';

export const useLocationTracking = () => {
  const sessionId = useOpenViduStore((state) => state.sessionId);

  useEffect(() => {
    let watchId: number;

    const handleSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;

      if (sessionId) {
        try {
          await dispatchLocation(sessionId, latitude, longitude);
        } catch (error) {
          console.error('Failed to send location:', error);
        }
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('Error getting location:', error);
    };

    const startLocationTracking = () => {
      if ('geolocation' in navigator) {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        // 초기 위치 가져오기
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

        // 위치 변경 감지 시작
        watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
      } else {
        console.error('Geolocation is not supported by this browser');
      }
    };

    // 서비스 워커 등록
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
    startLocationTracking();

    // Clean up
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [sessionId]);
};