import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {axiosInstance} from '@/utils/axios';
import { Hospital, HospitalResponse } from '@/features/dispatch/types/hospital.types';
import { useDispatchPatientStore } from '@/store/dispatch/dispatchPatientStore';

interface AddressInfo {
  siDo: string;
  siGunGu: string;
}

interface RouteInfo {
  eta: number | "알 수 없음";
  distance: number | "알 수 없음";
}

export const useHospitalSearch = () => {
  // formData를 최상단에 추가
  const formData = useDispatchPatientStore((state) => state.formData);

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(1.0);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [requestedHospitals, setRequestedHospitals] = useState<Set<number>>(new Set());
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchedRadius, setLastSearchedRadius] = useState(0);


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
    setTimeout(() => setError(null), 3000);
  }, []);

  // TMAP API를 사용한 경로 계산
  const calculateRoute = useCallback(async (
    startLat: number, 
    startLng: number, 
    endLat: number, 
    endLng: number
  ): Promise<RouteInfo> => {
    const TMAP_API_KEY = import.meta.env.VITE_TMAP_API_KEY;
  
    try {
      // 좌표 유효성 검사
      if (!startLat || !startLng || !endLat || !endLng) {
        console.log('유효하지 않은 좌표:', { startLat, startLng, endLat, endLng });
        return { eta: "알 수 없음", distance: "알 수 없음" };
      }
  
      const response = await axios.post(
        "https://apis.openapi.sk.com/tmap/routes",
        {
          "version": 1,
          "format": "json",
          "startName": "출발지",
          "endName": "도착지",
          "startX": startLng,
          "startY": startLat,
          "endX": endLng,
          "endY": endLat,
          "reqCoordType": "WGS84GEO",
          "resCoordType": "WGS84GEO",
          "searchOption": "0",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "appKey": TMAP_API_KEY,
          },
        }
      );
  
      if (response.data.features?.[0]?.properties) {
        const { totalTime, totalDistance } = response.data.features[0].properties;
        return {
          eta: Math.round(totalTime / 60),  // 초를 분으로 변환
          distance: Math.round(totalDistance / 100) / 10  // 미터를 km로 변환
        };
      }
      return { eta: "알 수 없음", distance: "알 수 없음" };
    } catch (error) {
      console.error("Tmap API 호출 실패:", error);
      return { eta: "알 수 없음", distance: "알 수 없음" };
    }
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
  // 현재 위치 가져오기
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        try {
          // 먼저 주소 정보를 가져옴
          const address = await getAddressInfo(location.lat, location.lng);
          // 주소 정보가 성공적으로 얻어진 후에 위치 설정
          setAddressInfo(address);
          setCurrentLocation(location);
        } catch (error) {
          handleError(error);
          // 에러 발생 시 서울역 좌표로 설정
          const defaultLocation = {
            lat: 37.5546788,  // 서울역 위도
            lng: 126.9706069, // 서울역 경도
          };
          const defaultAddress = {
            siDo: "서울특별시",
            siGunGu: "중구"
          };
          setAddressInfo(defaultAddress);
          setCurrentLocation(defaultLocation);
        }
      },
      (error) => {
        handleError(error);
        // 위치 권한 거부 시에도 서울역 좌표로 설정
        const defaultLocation = {
          lat: 37.5546788,
          lng: 126.9706069,
        };
        const defaultAddress = {
          siDo: "서울특별시",
          siGunGu: "중구"
        };
        setAddressInfo(defaultAddress);
        setCurrentLocation(defaultLocation);
      }
    );
  }
}, [getAddressInfo, handleError]);

  const requestTransfer = useCallback(async (hospitalIds: number[]) => {
    try {
      if (!formData?.dispatchId || !formData?.patientId) {
        handleError(new Error('출동 정보가 없습니다. 출동 지령을 먼저 받아주세요.'));
        return false;
      }

      console.log('Sending transfer request:', {
        dispatchId: formData.dispatchId,
        hospitalIds,
        patientId: formData.patientId
      });

      // 직접 객체를 만들어서 전송
      const response = await axiosInstance.post('/dispatch_staff/emergency_rooms/request', {
        dispatchId: formData.dispatchId,
        hospitalIds,
        patientId: formData.patientId
      });

      if (response.data.isSuccess) {
        setRequestedHospitals(prev => {
          const newSet = new Set(prev);
          hospitalIds.forEach(id => newSet.add(id));
          return newSet;
        });

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
  }, [formData, handleError]);

  // 병원 검색
  const searchHospitals = useCallback(async (radius: number) => {
    if (!currentLocation) return [];

    try {
      const response = await axiosInstance.get<HospitalResponse>(
        '/dispatch_staff/emergency_room',
        {
          params: {
            siDo: addressInfo?.siDo,
            siGunGu: addressInfo?.siGunGu,
            longitude: currentLocation.lng,
            latitude: currentLocation.lat,
            range: radius
          }
        }
      );

      if (response.data.isSuccess) {
        const hospitalPromises = response.data.data.map(async (hospital) => {
          const routeInfo = await calculateRoute(
            currentLocation.lat,
            currentLocation.lng,
            hospital.hospitalLat,
            hospital.hospitalLng
          );

          return {
            ...hospital,
            requested: requestedHospitals.has(hospital.hospitalId),
            eta: routeInfo.eta === "알 수 없음" ? Math.round(hospital.distance * 2) : routeInfo.eta,
            distance: routeInfo.distance === "알 수 없음" ? hospital.distance : routeInfo.distance
          } as Hospital;
        });

        const newHospitals = await Promise.all(hospitalPromises);
        const sortedHospitals = newHospitals.sort((a, b) => a.distance - b.distance);

        // 중복 제거 및 상태 업데이트
        setHospitals(prev => {
          const existingIds = new Set(prev.map(h => h.hospitalId));
          const uniqueHospitals = sortedHospitals.filter(h => !existingIds.has(h.hospitalId));
          const updatedHospitals = [...prev, ...uniqueHospitals];
          return updatedHospitals.sort((a, b) => a.distance - b.distance);
        });

        setLastSearchedRadius(radius);
        return sortedHospitals;
      }
      return [];
    } catch (error) {
      handleError(error);
      return [];
    }
  }, [currentLocation, addressInfo, calculateRoute, requestedHospitals, handleError]);

  const handleSearch = useCallback(async () => {
    if (!currentLocation || !addressInfo) return;

    setIsSearching(true);
    const foundHospitals = await searchHospitals(searchRadius);

    // 새로 찾은 병원들 중 아직 요청하지 않은 병원들의 ID 추출
    const newHospitalIds = foundHospitals
      .filter(hospital => !hospital.requested)
      .map(hospital => hospital.hospitalId);

    // 이송 요청할 병원이 있으면 요청 보내기
    if (newHospitalIds.length > 0) {
      console.log(`${searchRadius}km 반경 병원 이송 요청:`, newHospitalIds);
      await requestTransfer(newHospitalIds);
    }

    if (searchRadius < 10) {
      setTimeout(() => {
        setSearchRadius(prev => prev + 1);
      }, 10000);
    } else {
      setIsSearching(false);
    }
  }, [searchRadius, currentLocation, addressInfo, searchHospitals, requestTransfer]);

  // 검색 시작 시 자동으로 실행
  useEffect(() => {
    if (currentLocation && addressInfo && isSearching && searchRadius <= 10) {
      handleSearch();
    }
  }, [searchRadius, currentLocation, addressInfo, isSearching, handleSearch]);

  const stopSearch = useCallback(() => {
    setIsSearching(false);
    setSearchRadius(1.0);
    setLastSearchedRadius(0);
  }, []);

  // 검색 시작 시 자동으로 실행
  useEffect(() => {
    if (currentLocation && addressInfo && isSearching && searchRadius <= 10) {
      handleSearch();
    }
  }, [searchRadius, currentLocation, addressInfo, isSearching, handleSearch]);

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