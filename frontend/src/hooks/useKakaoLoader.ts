import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk';
import { useState, useEffect } from 'react';

export default function useKakaoLoader() {
  console.log('KAKAO API KEY:', import.meta.env.VITE_KAKAOMAP_API_KEY);
  const [fireStations, setFireStations] = useState([]);

  useKakaoLoaderOrigin({
    appkey: import.meta.env.VITE_KAKAOMAP_API_KEY,
    libraries: ['clusterer', 'drawing', 'services'],
  });

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch('소방서', (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setFireStations(data);
        }
      });
    }
  }, []);
return {fireStations}
}
