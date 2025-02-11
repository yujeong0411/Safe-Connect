// src/features/dispatch/hooks/useHospitalSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { Hospital } from '@/features/dispatch/types/hospital.types';

export const useHospitalSearch = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(500);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [requestedHospitals, setRequestedHospitals] = useState<Set<string>>(new Set());
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState<number | null>(null);

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
          // 기본 위치 설정 (예: 서울시청)
          setCurrentLocation({
            lat: 37.5665,
            lng: 126.9780,
          });
        }
      );
    }
  }, []);

  const searchHospitals = useCallback(async () => {
    if (!currentLocation || !isKakaoLoaded) {
      console.log('필요한 서비스가 준비되지 않음:', { currentLocation, isKakaoLoaded });
      return [];
    }

    return new Promise<Hospital[]>((resolve, reject) => {
      try {
        const places = new kakao.maps.services.Places();
        
        const searchCallback = (data: any[], status: any) => {
          if (status === kakao.maps.services.Status.OK) {
            const newHospitals = data
              .filter(place => place.category_group_code === 'HP8')
              .map(place => ({
                id: place.id,
                place_name: place.place_name,
                distance: (parseInt(place.distance) / 1000).toFixed(1),
                x: place.x,
                y: place.y,
                requested: requestedHospitals.has(place.id)
              }));
            console.log(`${searchRadius}m 반경 검색 결과:`, newHospitals);
            resolve(newHospitals);
          } else {
            console.log(`${searchRadius}m 반경 검색 결과 없음`);
            resolve([]);
          }
        };

        places.keywordSearch('병원', searchCallback, {
          location: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
          radius: searchRadius,
          sort: kakao.maps.services.SortBy.DISTANCE
        });
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
        resolve([]);
      }
    });
  }, [currentLocation, searchRadius, requestedHospitals, isKakaoLoaded]);

  const handleSearch = useCallback(async () => {
    if (!isKakaoLoaded || !currentLocation) return;
  
    setIsSearching(true);
    setLastSearchTime(Date.now());
  
    try {
      const newHospitals = await searchHospitals();
      
      setHospitals(prev => {
        const existingIds = new Set(prev.map(h => h.id));
        const uniqueNewHospitals = newHospitals.filter(h => !existingIds.has(h.id));
        const result = [...prev, ...uniqueNewHospitals];
        
        // 30초 후 다음 반경 검색 시작 (결과 유무와 관계없이)
        if (searchRadius < 5000) {  // 최대 5km까지
          setTimeout(() => {
            setSearchRadius(prev => prev + 500);
            handleSearch();  // 재귀적으로 다음 반경 검색
          }, 30000);  // 30초 후 다음 검색 시작
        } else {
          setIsSearching(false);
        }
        
        return result;
      });
    } catch (error) {
      console.error('검색 처리 중 오류:', error);
      setIsSearching(false);
    }
  }, [searchHospitals, isKakaoLoaded, currentLocation, searchRadius]);

  const markHospitalsAsRequested = useCallback((hospitalIds: string[]) => {
    setRequestedHospitals(prev => new Set([...prev, ...hospitalIds]));
    setHospitals(prev => 
      prev.map(hospital => ({
        ...hospital,
        requested: requestedHospitals.has(hospital.id) || hospitalIds.includes(hospital.id)
      }))
    );
  }, [requestedHospitals]);

  return {
    hospitals,
    searchRadius,
    handleSearch,
    markHospitalsAsRequested,
    currentLocation,
    isReady: isKakaoLoaded && currentLocation !== null,
    isSearching
  };
};