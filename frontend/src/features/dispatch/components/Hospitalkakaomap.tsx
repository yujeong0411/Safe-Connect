import { useEffect, useRef } from 'react';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { Hospital } from '../types/hospital.types';
import ambulanceimage from '@assets/image/119maker.png'
import emergencyimage from '@assets/image/emergency.png'
import callerimage from '@assets/image/marker2.png'

interface HospitalKakaoMapProps {
  currentLocation: { lat: number; lng: number } | null;
  hospitals: Hospital[];
  onHospitalSelect?: (hospitalId: number) => void;
  selectedHospitalId?: number;
  callerLocation?: { lat: number; lng: number; address: string; } | null;
}

const HospitalKakaoMap = ({ currentLocation, hospitals, onHospitalSelect, selectedHospitalId, callerLocation }: HospitalKakaoMapProps) => {
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
        ambulanceimage,
        new window.kakao.maps.Size(69, 69),
        { offset: new window.kakao.maps.Point(27,69)}
      )
    });

    return () => {
      currentLocationMarker.setMap(null);
    };
  }, [isKakaoLoaded, currentLocation]);

  // 병원 마커 업데이트
  useEffect(() => {
    if (!isKakaoLoaded || !mapRef.current || !hospitals.length) return;

  
    const bounds = new window.kakao.maps.LatLngBounds();
  
    // 현재 위치를 bounds에 추가
    if (currentLocation) {
      const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      bounds.extend(currentPos);
       }
  
    // 기존 마커 제거
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    Object.values(infoWindowsRef.current).forEach(infoWindow => infoWindow.close());
    markersRef.current = {};
    infoWindowsRef.current = {};
  
    hospitals.forEach(hospital => {
      // 위도/경도 로깅
  
      const position = new window.kakao.maps.LatLng(
        Number(hospital.hospitalLat), // 위도
        Number(hospital.hospitalLng)  // 경도
      );

      const marker = new window.kakao.maps.Marker({
        position: position,
        map: mapRef.current,
        image: new window.kakao.maps.MarkerImage(
          emergencyimage,
          new window.kakao.maps.Size(69, 69),
          { offset: new window.kakao.maps.Point(27, 69) }
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


  const callerMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const callerInfoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);

  // 신고자 위치정보
  useEffect(() => {
    if (!isKakaoLoaded || !mapRef.current || !callerLocation) return;

    // 기존 마커와 인포윈도우 제거
    if (callerMarkerRef.current) {
      callerMarkerRef.current.setMap(null);
      callerInfoWindowRef.current?.close();
    }

    const position = new window.kakao.maps.LatLng(callerLocation.lat, callerLocation.lng);

    // 새로운 마커 생성
    const callerMarker = new window.kakao.maps.Marker({
      position,
      map: mapRef.current,
      image: new window.kakao.maps.MarkerImage(
        callerimage,
        new window.kakao.maps.Size(69, 69),
        { offset: new window.kakao.maps.Point(27, 69) }
      )
    });
  
    callerMarkerRef.current = callerMarker;

    // 신고자 위치 인포윈도우우
    const callerInfoWindow = new window.kakao.maps.InfoWindow({
      content: `
      <div class="p-4 min-w-[200px] bg-white rounded shadow">
        <h3 class="font-bold text-lg mb-2">신고자 위치</h3>
        <div class="text-sm text-gray-600">
          <p>${callerLocation.address}</p>
        </div>
      </div>
    `,
    removable: true
    });

    callerInfoWindowRef.current = callerInfoWindow;

    // 마커 클릭시 정보창 표시
    kakao.maps.event.addListener(callerMarker, "click", () => {
      callerInfoWindow.open(mapRef.current!, callerMarker);
    });

    mapRef.current.setCenter(position);

    return () => {
      if (callerMarkerRef.current) {
        callerMarker.setMap(null);
      }
      if (callerInfoWindowRef.current) {
        callerInfoWindow.close();
      }
    };
  }, [isKakaoLoaded, callerLocation]);

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