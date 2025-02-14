import { useEffect, useRef } from 'react';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { Hospital } from '../types/hospital.types';

interface HospitalKakaoMapProps {
  currentLocation: { lat: number; lng: number } | null;
  hospitals: Hospital[];
  onHospitalSelect?: (hospitalId: number) => void;
  selectedHospitalId?: number;
}

const HospitalKakaoMap = ({ currentLocation, hospitals, onHospitalSelect, selectedHospitalId }: HospitalKakaoMapProps) => {
  const isKakaoLoaded = useKakaoLoader();
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<{[key: number]: kakao.maps.Marker}>({});
  const infoWindowsRef = useRef<{[key: number]: kakao.maps.InfoWindow}>({});

  // 지도 초기화
  useEffect(() => {
    if (!isKakaoLoaded || !currentLocation || !window.kakao?.maps) return;

    const container = document.getElementById('map');
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      level: 5
    };

    const map = new window.kakao.maps.Map(container, options);
    mapRef.current = map;

    // 현재 위치 마커 추가
    const currentLocationMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      map: map,
      image: new window.kakao.maps.MarkerImage(
        '/src/assets/image/ambulance.png',
        new window.kakao.maps.Size(35, 35),
        { offset: new window.kakao.maps.Point(17, 17) }
      )
    });

    return () => {
      currentLocationMarker.setMap(null);
    };
  }, [isKakaoLoaded, currentLocation]);

  // 병원 마커 업데이트
  useEffect(() => {
    if (!isKakaoLoaded || !mapRef.current || !hospitals.length) return;
  
    console.log('Hospitals data:', hospitals); // 디버깅용
  
    const bounds = new window.kakao.maps.LatLngBounds();
  
    // 현재 위치를 bounds에 추가
    if (currentLocation) {
      const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      bounds.extend(currentPos);
      console.log('Current location added:', currentLocation); // 디버깅용
    }
  
    // 기존 마커 제거
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    Object.values(infoWindowsRef.current).forEach(infoWindow => infoWindow.close());
    markersRef.current = {};
    infoWindowsRef.current = {};
  
    hospitals.forEach(hospital => {
      // 위도/경도 로깅
      console.log('Hospital position:', {
        name: hospital.hospitalName,
        lat: hospital.hospitalLocation.y,
        lng: hospital.hospitalLocation.x
      });
  
      const position = new window.kakao.maps.LatLng(
        Number(hospital.hospitalLocation.y), // 위도
        Number(hospital.hospitalLocation.x)  // 경도
      );
  
      const marker = new window.kakao.maps.Marker({
        position: position,
        map: mapRef.current,
        image: new window.kakao.maps.MarkerImage(
          '/src/assets/image/emergency.png',
          new window.kakao.maps.Size(35, 35),
          { offset: new window.kakao.maps.Point(17, 17) }
        )
      });
  
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div class="p-4 min-w-[200px] bg-white rounded shadow">
            <h3 class="font-bold text-lg mb-2">${hospital.hospitalName}</h3>
            <div class="text-sm text-gray-600">
              <p>거리: ${hospital.distance.toFixed(1)}km</p>
              <p>수용가능 인원: ${hospital.hospitalCapacity}명</p>
              ${hospital.requested ? '<p class="text-red-500">요청됨</p>' : ''}
            </div>
          </div>
        `,
        removable: true
      });
  
      kakao.maps.event.addListener(marker, 'click', () => {
        // 다른 모든 인포윈도우 닫기
        Object.values(infoWindowsRef.current).forEach(info => info.close());
        
        // 현재 인포윈도우 열기
        infoWindow.open(mapRef.current!, marker);
        
        // 선택한 병원 ID 전달
        onHospitalSelect?.(hospital.hospitalId);
      });
  
      markersRef.current[hospital.hospitalId] = marker;
      infoWindowsRef.current[hospital.hospitalId] = infoWindow;
      bounds.extend(position);
    });
  
    // bounds가 비어있지 않은 경우에만 적용
    if (!bounds.isEmpty()) {
      console.log('Setting map bounds'); // 디버깅용
      mapRef.current.setBounds(bounds, 50);
    }
  }, [isKakaoLoaded, hospitals, currentLocation, onHospitalSelect]);

  // 선택된 병원 처리
  useEffect(() => {
    if (!isKakaoLoaded || !selectedHospitalId || !mapRef.current) return;

    const marker = markersRef.current[selectedHospitalId];
    const infoWindow = infoWindowsRef.current[selectedHospitalId];

    if (marker && infoWindow) {
      Object.values(infoWindowsRef.current).forEach(info => info.close());
      infoWindow.open(mapRef.current, marker);
      mapRef.current.panTo(marker.getPosition());
    }
  }, [isKakaoLoaded, selectedHospitalId]);

  return (
    <div id="map" style={{ width: '100%', height: '100%' }}>
      {!isKakaoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p>지도를 불러오는 중입니다...</p>
        </div>
      )}
      {isKakaoLoaded && !currentLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p>위치 정보를 불러오는 중입니다...</p>
        </div>
      )}
    </div>
  );
};

export default HospitalKakaoMap;