import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import axiosInstance from '@/features/dispatch/api/axios';
import { Hospital, HospitalResponse } from '@/features/dispatch/types/hospital.types';

interface AddressInfo {
  siDo: string;
  siGunGu: string;
}

interface TransferRequestParams {
  hospitalIds: number[];
}

export const useHospitalSearch = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(1.0);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [requestedHospitals] = useState<Set<number>>(new Set());
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 에러 메시지 설정 함수
  const handleError = useCallback((error: unknown) => {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';
    
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    setError(errorMessage);
    console.error('오류 발생:', errorMessage);
    
    // 3초 후 에러 메시지 초기화
    setTimeout(() => setError(null), 3000);
  }, []);

  // 좌표로 주소 정보 가져오기
  const getAddressInfo = useCallback(async (lat: number, lng: number): Promise<AddressInfo> => {
    return new Promise((resolve) => {
      if (!window.kakao?.maps?.services) {
        const defaultAddress = {
          siDo: "서울특별시",
          siGunGu: "중구"
        };
        setAddressInfo(defaultAddress);
        resolve(defaultAddress);
        return;
      }

      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2RegionCode(lng, lat, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result && result[0]) {
          const address = {
            siDo: result[0].region_1depth_name,
            siGunGu: result[0].region_2depth_name
          };
          setAddressInfo(address);
          resolve(address);
        } else {
          const defaultAddress = {
            siDo: "서울특별시",
            siGunGu: "중구"
          };
          setAddressInfo(defaultAddress);
          resolve(defaultAddress);
        }
      });
    });
  }, []);

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          try {
            await getAddressInfo(location.lat, location.lng);
          } catch (error) {
            handleError(error);
          }
        },
        (error) => {
          handleError(error);
          const defaultLocation = {
            lat: 37.5665,
            lng: 126.978,
          };
          setCurrentLocation(defaultLocation);
          getAddressInfo(defaultLocation.lat, defaultLocation.lng);
        }
      );
    }
  }, [getAddressInfo, handleError]);

  // 병원 검색
  const searchHospitals = useCallback(async (radius: number) => {
    if (!currentLocation) return;
  
    try {
      // 카카오맵 Geocoder로 현재 위치의 행정구역 정보 획득
      const addressInfo = await new Promise<{siDo: string; siGunGu: string}>((resolve, reject) => {
        const geocoder = new kakao.maps.services.Geocoder();
        
        geocoder.coord2RegionCode(
          currentLocation.lng, 
          currentLocation.lat, 
          (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              // 첫 번째 결과에서 시도와 시군구 정보 추출
              const region = result[0];
              resolve({
                siDo: region.region_1depth_name,      // 시도 (예: "광주광역시")
                siGunGu: region.region_2depth_name    // 시군구 (예: "광산구")
              });
            } else {
              reject(new Error('주소 변환에 실패했습니다.'));
            }
          }
        );
      });
  
      console.log('위치 정보:', {
        위치: currentLocation,
        행정구역: addressInfo,
        반경: radius
      });
  
      // 백엔드 API 호출
      const response = await axiosInstance.get<HospitalResponse>(
        '/dispatch_staff/emergency_room',
        {
          params: {
            siDo: addressInfo.siDo,
            siGunGu: addressInfo.siGunGu,
            longitude: currentLocation.lng,
            latitude: currentLocation.lat,
            range: radius
          }
        }
      );
  
      if (response.data.isSuccess) {
        const newHospitals: Hospital[] = response.data.data.map((hospital) => ({
          ...hospital,
          requested: requestedHospitals.has(hospital.hospitalId)
        }));
  
        setHospitals(prev => {
          const existingIds = new Set(prev.map((h: Hospital) => h.hospitalId));
          const uniqueNewHospitals = newHospitals.filter((h: Hospital) => !existingIds.has(h.hospitalId));
          return [...prev, ...uniqueNewHospitals];
        });
  
        console.log('검색 결과:', {
          검색반경: `${radius}km`,
          검색결과수: newHospitals.length
        });
  
        return newHospitals;
      }
    } catch (error) {
      let errorMessage = '병원 검색 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        if (error.message === '주소 변환에 실패했습니다.') {
          errorMessage = '현재 위치의 주소를 확인할 수 없습니다.';
        } else if (axios.isAxiosError(error)) {
          if (error.response?.status === 500) {
            errorMessage = '서버 내부 오류가 발생했습니다.';
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
        }
      }
  
      handleError(errorMessage);
      return [];
    }
  }, [currentLocation, requestedHospitals, handleError]);
  // 이송 요청
  const requestTransfer = useCallback(async (hospitalIds: number[]) => {
    try {
      const response = await axiosInstance.post('/dispatch_staff/emergency_rooms/request', {
        hospitalIds
      } as TransferRequestParams);

      if (response.data.isSuccess) {
        markHospitalsAsRequested(hospitalIds);
        return true;
      }
      return false;
    } catch (error) {
      handleError(error);
      return false;
    }
  }, [handleError]);

  const handleSearch = useCallback(async () => {
    if (!currentLocation || !addressInfo) return;
    
    setIsSearching(true);
    await searchHospitals(searchRadius);

    if (searchRadius < 10) {
      setTimeout(() => {
        setSearchRadius(prev => prev + 1);
      }, 10000);
    } else {
      setIsSearching(false);
    }
  }, [searchRadius, currentLocation, addressInfo, searchHospitals]);

  const stopSearch = useCallback(() => {
    setIsSearching(false);
    setSearchRadius(1.0);
  }, []);

  // 검색 시작 시 자동으로 실행
  useEffect(() => {
    if (currentLocation && addressInfo && isSearching && searchRadius <= 10) {
      handleSearch();
    }
  }, [searchRadius, currentLocation, addressInfo, isSearching, handleSearch]);

  const markHospitalsAsRequested = useCallback((hospitalIds: number[]) => {
    setHospitals(prev =>
      prev.map(hospital => ({
        ...hospital,
        requested: hospital.requested || hospitalIds.includes(hospital.hospitalId)
      }))
    );
  }, []);

  return {
    hospitals,
    searchRadius,
    handleSearch,
    stopSearch,
    requestTransfer,
    markHospitalsAsRequested,
    currentLocation,
    isSearching,
    addressInfo,
    error
  };
};