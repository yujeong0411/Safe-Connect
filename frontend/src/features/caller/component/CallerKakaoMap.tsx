import { useState, useEffect, useCallback } from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { Marker } from "@features/control/types/kakaoMap.types";

interface EMTLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const CallerKakaoMaps = () => {
  useKakaoLoader();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [emtLocation, setEmtLocation] = useState<EMTLocation | null>(null);
  const [info, setInfo] = useState<boolean>(false);
  const [state, setState] = useState({
    center: { lat: 33.450701, lng: 126.570667 },
    isLoading: true,
  });

  // 사용자 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setState({
            center: newCenter,
            isLoading: false,
          });
        },
        () => {
          setState({
            center: { lat: 37.566826, lng: 126.9786567 },
            isLoading: false,
          });
        }
      );
    }
  }, []);

  // SSE 연결 설정
  const setupSSEConnection = useCallback(() => {
    const eventSource = new EventSource('/api/emt-location');

    eventSource.onmessage = (event) => {
      const locationUpdate: EMTLocation = JSON.parse(event.data);
      setEmtLocation(locationUpdate);
    };

    eventSource.onerror = (error) => {
      console.error('SSE 연결 에러:', error);
      eventSource.close();
      // 재연결 로직
      setTimeout(setupSSEConnection, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // SSE 연결 초기화
  useEffect(() => {
    const cleanup = setupSSEConnection();
    return cleanup;
  }, [setupSSEConnection]);

  // 지도 범위 조정
  useEffect(() => {
    if (!map || !emtLocation) return;

    const bounds = new kakao.maps.LatLngBounds();

    // 현재 위치 포함
    bounds.extend(new kakao.maps.LatLng(state.center.lat, state.center.lng));

    // EMT 위치 포함
    bounds.extend(new kakao.maps.LatLng(emtLocation.latitude, emtLocation.longitude));

    map.setBounds(bounds);
  }, [map, emtLocation, state.center]);

  const getLocationStatus = (timestamp: number): string => {
    const age = Date.now() - timestamp;
    if (age < 60000) return 'online';     // 1분 이내: 온라인
    if (age < 300000) return 'delayed';   // 5분 이내: 지연
    return 'offline';                      // 5분 이상: 오프라인
  };

  return (
    <Map
      id="map"
      center={state.center}
      style={{
        width: '100%',
        height: '100%',
      }}
      level={4}
      onCreate={setMap}
    >
      {/* 현재 위치 마커 */}
      {!state.isLoading && (
        <MapMarker
          position={state.center}
          image={{
            src: 'https://cdn-icons-png.flaticon.com/512/7193/7193391.png',
            size: { width: 64, height: 69 },
            options: { offset: { x: 27, y: 69 } },
          }}
          title="현재 위치"
        />
      )}

      {/* 구급대원 위치 마커 */}
      {emtLocation && (
        <MapMarker
          position={{
            lat: emtLocation.latitude,
            lng: emtLocation.longitude,
          }}
          onClick={() => setInfo(!info)}
          image={{
            src: 'https://cdn.crowdpic.net/detail-thumb/thumb_d_95A0D99CD45AEE995519614F9B67AD41.png',
            size: { width: 64, height: 69 },
            options: { offset: { x: 27, y: 69 } },
          }}
        >
          {info && (
            <div style={{ color: '#000' }}>
              <p>구급대원 위치</p>
              <p>상태: {getLocationStatus(emtLocation.timestamp)}</p>
              <p>최종 업데이트: {new Date(emtLocation.timestamp).toLocaleTimeString()}</p>
            </div>
          )}
        </MapMarker>
      )}

      <MapTypeControl position={'TOPLEFT'} />
      <ZoomControl position={'LEFT'} />
    </Map>
  );
};

export default CallerKakaoMaps;