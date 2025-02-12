import { useState, useEffect, useCallback } from 'react';
import { Hospital } from '@/features/dispatch/types/hospital.types';

export const useHospitalSearch = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(500);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [requestedHospitals, setRequestedHospitals] = useState<Set<string>>(new Set());
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // Kakao Maps API 로드 체크
  useEffect(() => {
    const checkKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
      }
    };

    if (document.readyState === 'complete') {
      checkKakaoMap();
    } else {
      window.addEventListener('load', checkKakaoMap);
    }

    return () => window.removeEventListener('load', checkKakaoMap);
  }, []);

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          setCurrentLocation({
            lat: 37.5665,
            lng: 126.978,
          });
        }
      );
    }
  }, []);

  const searchHospitals = useCallback(async (radius: number) => {
    if (!currentLocation || !isKakaoLoaded) {
      console.log('❌ 검색 불가:', { currentLocation, isKakaoLoaded });
      return [];
    }

    return new Promise<Hospital[]>((resolve) => {
      try {
        const places = new kakao.maps.services.Places();
        
        const searchCallback = (data: any[], status: any) => {
          console.log(`📍 ${radius}m 반경 검색 결과:`, {
            status,
            totalResults: data?.length || 0
          });

          if (status === kakao.maps.services.Status.OK) {
            const filteredHospitals = data
              .filter(place => place.category_group_code === 'HP8')
              .map(place => ({
                id: place.id,
                place_name: place.place_name,
                distance: (parseInt(place.distance) / 1000).toFixed(1),
                x: place.x,
                y: place.y,
                requested: requestedHospitals.has(place.id)
              }));

            console.log('🏥 필터링된 병원:', {
              전체: data.length,
              병원수: filteredHospitals.length
            });

            resolve(filteredHospitals);
          } else {
            console.log('⚠️ 검색 결과 없음:', status);
            resolve([]);
          }
        };

        places.keywordSearch('병원', searchCallback, {
          location: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
          radius,
          sort: kakao.maps.services.SortBy.DISTANCE
        });
      } catch (error) {
        console.error('🚨 검색 중 오류:', error);
        resolve([]);
      }
    });
  }, [currentLocation, isKakaoLoaded, requestedHospitals]);

  const handleSearch = useCallback(async () => {
    if (!isKakaoLoaded || !currentLocation) return;

    setIsSearching(true);
    console.log('🔄 검색 시작:', { searchRadius });

    try {
      const currentResults = await searchHospitals(searchRadius);
      
      setHospitals(prev => {
        const existingIds = new Set(prev.map(h => h.id));
        const uniqueNewHospitals = currentResults.filter(h => !existingIds.has(h.id));
        
        console.log('📊 검색 결과 통계:', {
          기존병원: prev.length,
          새로검색: currentResults.length,
          중복제외: uniqueNewHospitals.length,
          최종병원수: prev.length + uniqueNewHospitals.length,
          현재반경: searchRadius
        });

        if (searchRadius < 5000) {
          const nextRadius = searchRadius + 500;
          console.log(`⏰ 30초 후 ${nextRadius}m 반경으로 재검색 예정`);
          
          setTimeout(() => {
            setSearchRadius(nextRadius);
            handleSearch();
          }, 30000);
        } else {
          console.log('🏁 최대 검색 반경(5km) 도달. 검색 종료');
          setIsSearching(false);
        }

        return [...prev, ...uniqueNewHospitals];
      });
    } catch (error) {
      console.error('🚨 검색 처리 중 오류:', error);
      setIsSearching(false);
    }
  }, [searchHospitals, isKakaoLoaded, currentLocation, searchRadius]);

  return {
    hospitals,
    searchRadius,
    handleSearch,
    // markHospitalsAsRequested,
    currentLocation,
    isReady: isKakaoLoaded && currentLocation !== null,
    isSearching
  };
};