import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk';
import { useEffect, useState } from 'react';

export default function useKakaoLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  // 직접 useKakaoLoaderOrigin 호출
  useKakaoLoaderOrigin({
    appkey: import.meta.env.VITE_KAKAOMAP_API_KEY || '',
    libraries: ['clusterer', 'drawing', 'services'],
  });

  useEffect(() => {
    // 이미 로드되어 있는지 체크
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    // 카카오맵 로드 완료 체크
    const checkKakaoMap = setInterval(() => {
      if (window.kakao?.maps) {
        setIsLoaded(true);
        clearInterval(checkKakaoMap);
      }
    }, 100);

    // 10초 후에도 로드되지 않으면 인터벌 정리
    setTimeout(() => clearInterval(checkKakaoMap), 10000);

    return () => clearInterval(checkKakaoMap);
  }, []);

  return isLoaded;
}