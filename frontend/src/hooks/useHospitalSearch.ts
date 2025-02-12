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

  // src/hooks/useHospitalSearch.ts
  const searchHospitals = useCallback(async () => {
    console.log('🔍 searchHospitals 호출됨', {
      currentLocation,
      searchRadius,
      isKakaoLoaded,
    });

    if (!currentLocation || !isKakaoLoaded) {
      console.log('❌ 검색 불가:', { currentLocation, isKakaoLoaded });
      return [];
    }

    return new Promise<Hospital[]>((resolve) => {
      try {
        const places = new kakao.maps.services.Places();

        const searchCallback = (data: any[], status: any) => {
          console.log(`📍 ${searchRadius}m 반경 검색 결과:`, {
            status,
            totalResults: data?.length || 0,
          });

          if (status === kakao.maps.services.Status.OK) {
            const filteredHospitals = data.filter((place) => place.category_group_code === 'HP8');
            console.log('🏥 필터링된 병원:', {
              전체: data.length,
              병원수: filteredHospitals.length,
            });

            const newHospitals = filteredHospitals.map((place) => ({
              id: place.id,
              place_name: place.place_name,
              distance: (parseInt(place.distance) / 1000).toFixed(1),
              x: place.x,
              y: place.y,
              requested: requestedHospitals.has(place.id),
            }));
            resolve(newHospitals);
          } else {
            console.log('⚠️ 검색 결과 없음:', status);
            resolve([]);
          }
        };

        places.keywordSearch('병원', searchCallback, {
          location: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
          radius: searchRadius,
          sort: kakao.maps.services.SortBy.DISTANCE,
        });
      } catch (error) {
        console.error('🚨 검색 중 오류 발생:', error);
        resolve([]);
      }
    });
  }, [currentLocation, searchRadius, requestedHospitals, isKakaoLoaded]);

  const handleSearch = useCallback(async () => {
    if (!isKakaoLoaded || !currentLocation) {
      console.log('❌ 검색 시작 불가:', { isKakaoLoaded, currentLocation });
      return;
    }

    console.log('🔄 검색 시작:', { searchRadius });
    try {
      setIsSearching(true);
      const newHospitals = await searchHospitals();

      setHospitals((prev) => {
        const existingIds = new Set(prev.map((h) => h.id));
        const uniqueNewHospitals = newHospitals.filter((h) => !existingIds.has(h.id));

        console.log('📊 검색 결과 통계:', {
          기존병원: prev.length,
          새로검색: newHospitals.length,
          중복제외: uniqueNewHospitals.length,
          최종병원수: prev.length + uniqueNewHospitals.length,
        });

        const result = [...prev, ...uniqueNewHospitals];

        if (searchRadius < 5000) {
          console.log(`⏰ 30초 후 ${searchRadius + 500}m 반경으로 재검색 예정`);
          setTimeout(async () => {
            const nextRadius = searchRadius + 500;
            console.log(`🔄 ${nextRadius}m 반경 검색 시작`);
            setSearchRadius(nextRadius);
            // 새로운 반경으로 직접 검색 실행
            const nextHospitals = await searchHospitals();
            setHospitals((prevHospitals) => {
              const existingIds = new Set(prevHospitals.map((h) => h.id));
              const uniqueNextHospitals = nextHospitals.filter((h) => !existingIds.has(h.id));
              return [...prevHospitals, ...uniqueNextHospitals];
            });

            // 다음 검색 예약
            if (nextRadius < 5000) {
              handleSearch();
            } else {
              console.log('🏁 최대 검색 반경(5km) 도달. 검색 종료');
              setIsSearching(false);
            }
          }, 30000);
        } else {
          console.log('🏁 최대 검색 반경(5km) 도달. 검색 종료');
          setIsSearching(false);
        }

        return result;
      });
    } catch (error) {
      console.error('🚨 검색 처리 중 오류:', error);
      setIsSearching(false);
    }
  }, [searchHospitals, isKakaoLoaded, currentLocation, searchRadius]);

  const markHospitalsAsRequested = useCallback(
    (hospitalIds: string[]) => {
      setRequestedHospitals((prev) => new Set([...prev, ...hospitalIds]));
      setHospitals((prev) =>
        prev.map((hospital) => ({
          ...hospital,
          requested: requestedHospitals.has(hospital.id) || hospitalIds.includes(hospital.id),
        }))
      );
    },
    [requestedHospitals]
  );

  return {
    hospitals,
    searchRadius,
    handleSearch,
    markHospitalsAsRequested,
    currentLocation,
    isReady: isKakaoLoaded && currentLocation !== null,
    isSearching,
  };
};
