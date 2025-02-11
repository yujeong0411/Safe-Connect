// src/features/dispatch/components/HospitalKakaoMap.tsx
import { useEffect, useRef } from 'react';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { Hospital } from '../types/hospital.types';

interface HospitalKakaoMapProps {
  currentLocation: { lat: number; lng: number } | null;
  hospitals: Hospital[];
}

const HospitalKakaoMap = ({ currentLocation, hospitals }: HospitalKakaoMapProps) => {
  useKakaoLoader();
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);

  // 지도 초기화
  useEffect(() => {
    if (!currentLocation || !window.kakao) return;

    const container = document.getElementById('map');
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      level: 3
    };

    const map = new window.kakao.maps.Map(container, options);
    mapRef.current = map;

    // 현재 위치 마커 추가
    const currentLocationMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      map: map,
      image: new window.kakao.maps.MarkerImage(
        '/icons/current-location.png',  // 현재 위치 아이콘
        new window.kakao.maps.Size(35, 35),
        { offset: new window.kakao.maps.Point(17, 17) }
      )
    });

    return () => {
      currentLocationMarker.setMap(null);
    };
  }, [currentLocation]);

  // 병원 마커 업데이트
  useEffect(() => {
    if (!mapRef.current || !window.kakao) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    const bounds = new window.kakao.maps.LatLngBounds();

    // 현재 위치를 bounds에 추가
    if (currentLocation) {
      bounds.extend(new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng));
    }

    hospitals.forEach(hospital => {
      const position = new window.kakao.maps.LatLng(
        parseFloat(hospital.y),
        parseFloat(hospital.x)
      );

      const marker = new window.kakao.maps.Marker({
        position: position,
        map: mapRef.current,
        image: new window.kakao.maps.MarkerImage(
          hospital.requested 
            ? '/icons/hospital-requested.png'  // 요청된 병원 아이콘
            : '/icons/hospital.png',           // 일반 병원 아이콘
          new window.kakao.maps.Size(35, 35),
          { offset: new window.kakao.maps.Point(17, 17) }
        )
      });

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div class="p-2">
            <strong>${hospital.place_name}</strong>
            <p>${hospital.distance}km</p>
            ${hospital.requested ? '<p style="color: #666;">(요청됨)</p>' : ''}
          </div>
        `
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', function() {
        infowindow.open(mapRef.current, marker);
      });

      // 지도 클릭 시 인포윈도우 닫기
      window.kakao.maps.event.addListener(mapRef.current, 'click', function() {
        infowindow.close();
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (!bounds.isEmpty()) {
      mapRef.current.setBounds(bounds, 50); // 여백 50px
    }
  }, [hospitals, currentLocation]);

  return (
    <div id="map" style={{ width: '100%', height: '100%' }}>
      {!currentLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p>위치 정보를 불러오는 중입니다...</p>
        </div>
      )}
    </div>
  );
};

export default HospitalKakaoMap;