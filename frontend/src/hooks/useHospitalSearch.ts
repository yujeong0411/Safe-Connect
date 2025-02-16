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
  const [lastSearchedRadius, setLastSearchedRadius] = useState(0);

  // 에러 핸들러
  const handleError = useCallback((error: unknown) => {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    setError(errorMessage);
    console.error('오류 발생:', errorMessage);
    setTimeout(() => setError(null), 3000);
  }, []);

  // 좌표 -> 주소 변환
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

  // 이송 요청
  const requestTransfer = useCallback(async (hospitalIds: number[]) => {
    try {
      const response = await axiosInstance.post('/dispatch_staff/emergency_rooms/request', {
        hospitalIds
      } as TransferRequestParams);

      if (response.data.isSuccess) {
        setHospitals(prev => 
          prev.map(hospital => ({
            ...hospital,
            requested: hospital.requested || hospitalIds.includes(hospital.hospitalId)
          }))
        );
        return true;
      }
      return false;
    } catch (error) {
      handleError(error);
      return false;
    }
  }, [handleError]);

  // 병원 검색
  const searchHospitals = useCallback(async (radius: number) => {
    if (!currentLocation || !addressInfo) {
      console.log('위치 정보 없음:', { currentLocation, addressInfo });
      return [];
    }

    try {
      console.log('검색 요청 파라미터:', {
        siDo: addressInfo.siDo,
        siGunGu: addressInfo.siGunGu,
        longitude: currentLocation.lng,
        latitude: currentLocation.lat,
        range: radius
      });

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
        const existingHospitalIds = new Set(hospitals.map(h => h.hospitalId));
        const newHospitals = response.data.data.filter(
          hospital => !existingHospitalIds.has(hospital.hospitalId) && 
                     !requestedHospitals.has(hospital.hospitalId)
        );

        if (newHospitals.length > 0) {
          setHospitals(prev => [...prev, ...newHospitals]);
          await requestTransfer(newHospitals.map(h => h.hospitalId));
        }

        setLastSearchedRadius(radius);
        return newHospitals;
      }
      return [];
    } catch (error) {
      handleError(error);
      return [];
    }
  }, [currentLocation, addressInfo, hospitals, requestedHospitals, requestTransfer, handleError]);

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

  // 검색 시작/중지 핸들러
  const handleSearch = useCallback(() => {
    if (!currentLocation || !addressInfo) {
      handleError(new Error('위치 정보가 없습니다.'));
      return;
    }
    
    setIsSearching(true);
    searchHospitals(searchRadius);
  }, [currentLocation, addressInfo, searchRadius, searchHospitals, handleError]);

  // 검색 중지
  const stopSearch = useCallback(() => {
    setIsSearching(false);
    setSearchRadius(1.0);
    setLastSearchedRadius(0);
  }, []);

  // 자동 검색 타이머
  useEffect(() => {
    if (isSearching && searchRadius <= 10) {
      const timer = setTimeout(() => {
        if (searchRadius < 10) {
          setSearchRadius(prev => prev + 1);
        } else {
          setIsSearching(false);
        }
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [searchRadius, isSearching]);

  // 반경 변경시 자동 검색
  useEffect(() => {
    if (isSearching && currentLocation && addressInfo) {
      searchHospitals(searchRadius);
    }
  }, [searchRadius, isSearching, currentLocation, addressInfo, searchHospitals]);

  return {
    hospitals,
    searchRadius,
    handleSearch,
    stopSearch,
    requestTransfer,
    currentLocation,
    isSearching,
    addressInfo,
    error,
    lastSearchedRadius
  };
};