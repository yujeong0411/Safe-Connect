import { useState, useEffect, useCallback } from 'react';
import { Hospital } from '@/features/dispatch/types/hospital.types';

export const useHospitalSearch = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(500);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [requestedHospitals, setRequestedHospitals] = useState<Set<string>>(new Set());

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
        }
      );
    }
  }, []);

  // src/features/dispatch/hooks/useHospitalSearch.ts
  const searchHospitals = useCallback(async () => {
    if (!currentLocation) {
      console.log('현재 위치 없음:', currentLocation);
      return [];
    }
    if (!window.kakao) {
      console.log('카카오맵 API 로드 안됨');
      return [];
    }
  
    console.log('검색 시작:', {
      location: currentLocation,
      radius: searchRadius
    });
  
    const ps = new window.kakao.maps.services.Places();
    
    return new Promise<Hospital[]>((resolve, reject) => {
      ps.keywordSearch(
        '응급실',
        (data: any[], status: any) => {
          console.log('검색 결과:', { status, data });
          if (status === window.kakao.maps.services.Status.OK) {
            const newHospitals = data.map(place => ({
              id: place.id,
              place_name: place.place_name,
              distance: (parseInt(place.distance) / 1000).toFixed(1),
              x: place.x,
              y: place.y,
              requested: requestedHospitals.has(place.id)
            }));
            resolve(newHospitals);
          } else {
            resolve([]);
          }
        },
        {
          location: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
          radius: searchRadius,
          category_group_code: 'HP8'  // 병원 카테고리 코드 추가
        }
      );
    });
  }, [currentLocation, searchRadius, requestedHospitals]);
  
  const handleSearch = async () => {
    try {
      console.log('검색 시작');
      const newHospitals = await searchHospitals();
      console.log('검색된 병원:', newHospitals);
      
      setHospitals(prev => {
        const existingIds = new Set(prev.map(h => h.id));
        const uniqueNewHospitals = newHospitals.filter(h => !existingIds.has(h.id));
        const result = [...prev, ...uniqueNewHospitals];
        console.log('최종 병원 목록:', result);
        return result;
      });
    } catch (error) {
      console.error('검색 실패:', error);
    }
  };

  const increaseRadius = () => {
    setSearchRadius((prev) => prev + 500);
  };

  const decreaseRadius = () => {
    setSearchRadius((prev) => Math.max(500, prev - 500));
  };

  const markHospitalsAsRequested = (hospitalIds: string[]) => {
    setRequestedHospitals((prev) => new Set([...prev, ...hospitalIds]));
    setHospitals((prev) =>
      prev.map((hospital) => ({
        ...hospital,
        requested: requestedHospitals.has(hospital.id) || hospitalIds.includes(hospital.id),
      }))
    );
  };

  return {
    hospitals,
    searchRadius,
    increaseRadius,
    decreaseRadius,
    handleSearch,
    markHospitalsAsRequested,
    currentLocation,
  };
};
