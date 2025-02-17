import { useState, useEffect } from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import useKakaoLoader from '@/hooks/useKakaoLoader.ts';
import {
  Marker,
  ExtendedKakaoMapProps,
  FireStation,
} from '@features/control/types/kakaoMap.types.ts';
import userMaker from '@assets/image/marker2.png';
import dispatchMarker from '@assets/image/119maker.png';
import { useLocationStore } from '@/store/location/locationStore.tsx';
import axios from 'axios';

const KakaoMaps = ({ FindFireStations, onMarkerClick, selectedStation }: ExtendedKakaoMapProps) => {
  useKakaoLoader();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [info, setInfo] = useState<Marker | null>(null);
  const { center, isLoading } = useLocationStore();
  const TMAP_API_KEY = import.meta.env.VITE_TMAP_API_KEY;


  useEffect(() => {
    if (navigator.geolocation && !center.lat && !center.lng) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('위치 가져오기 성공:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          useLocationStore
            .getState()
            .setLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // 위치 거부시 현재 저장된 위치 유지 (초기값이나 마지막으로 받은 신고자 위치)
          useLocationStore.getState().setIsLoading(false);
        }
      );
    }
  }, [center]);

  // Tmap API를 사용하여 예상 도착 시간과 거리 계산
  const calculateRoute = async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ) => {
    try {
      // 먼저 유효한 좌표값인지 확인
      // 출동 지령 후 재 랜더링 되면서 소방서 검색 시도 -> 중심좌표가 초기화되면서 400 에러 발생
      // 좌표 검사 후 기본값 반환
      if (!startLat || !startLng || !endLat || !endLng) {
        console.log('유효하지 않은 좌표:', { startLat, startLng, endLat, endLng });
        return { eta: '알 수 없음', distance: '알 수 없음' };
      }

      const response = await axios.post(
        'https://apis.openapi.sk.com/tmap/routes', // URL에서 쿼리파라미터 제거
        {
          version: 1, // 필수 파라미터 추가
          format: 'json', // 필수 파라미터 추가
          startName: '출발지', // 필수 파라미터 추가
          endName: '도착지', // 필수 파라미터 추가
          startX: startLng, // 숫자 그대로 전달
          startY: startLat, // 숫자 그대로 전달
          endX: endLng, // 숫자 그대로 전달
          endY: endLat, // 숫자 그대로 전달
          reqCoordType: 'WGS84GEO',
          resCoordType: 'WGS84GEO',
          searchOption: '0', // 옵션 값 수정
        },
        {
          headers: {
            'Content-Type': 'application/json',
            appKey: TMAP_API_KEY,
          },
        }
      );

      if (response.data.features?.[0]?.properties) {
        const { totalTime, totalDistance } = response.data.features[0].properties;
        return {
          eta: Math.round(totalTime / 60), // 초를 분으로 변환
          distance: Math.round(totalDistance / 100) / 10, // 미터를 km로 변환하고 소수점 한자리로
        };
      }
      return null;
    } catch (error) {
      console.error('🚨 Tmap API 호출 실패:', error);
      return { eta: '알 수 없음', distance: '알 수 없음' };
    }
  };

  // 소방서 검색 후 마커 업데이트
  useEffect(() => {
    console.log('현재 center 값:', center);  // center 값 확인
    // -> 출동 지령 후 에러 해결
    if (!map || !center.lat || !center.lng) {
      console.log('지도 또는 중심 좌표가 없음:', { map, center });
      return;
    }

    const searchFireStations = async () => {
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(
        '소방서',
        async (data, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const bounds = new kakao.maps.LatLngBounds();
            const filteredData = data.filter(
              (place) =>
                !place.place_name.includes('안전센터') && !place.place_name.includes('구조대')
            );

            const newMarkers = await Promise.all(
              filteredData.map(async (place) => {
                const position = {
                  lat: parseFloat(place.y),
                  lng: parseFloat(place.x),
                };
                bounds.extend(new kakao.maps.LatLng(position.lat, position.lng));

                const routeInfo = await calculateRoute(
                  center.lat,
                  center.lng,
                  position.lat,
                  position.lng
                );

                return {
                  position,
                  content: place.place_name,
                  eta: routeInfo ? `${routeInfo.eta}분` : '계산 중...',
                  distance: routeInfo ? `${routeInfo.distance}km` : '계산 중...',
                  placeData: {
                    ...place,
                    eta: routeInfo?.eta,
                    distance: routeInfo?.distance,
                  },
                };
              })
            );

            setMarkers(newMarkers);
            if (FindFireStations) {
              const stationsWithRouteInfo = filteredData.map((station, index) => ({
                ...station,
                eta: newMarkers[index].eta,
                distance: newMarkers[index].distance,
              }));
              FindFireStations(stationsWithRouteInfo);
            }
            map.setBounds(bounds);
          }
        },
        {
          location: new kakao.maps.LatLng(center.lat, center.lng),
          radius: 10000,
        }
      );
    };

    searchFireStations();
  }, [map, center, FindFireStations]);

  // center가 변경될 때마다 중심 이동
  useEffect(() => {
    if (map) {
      map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [map, center]);

  // 마커 클릭 시
  const handleMarkerClick = (marker: Marker) => {
    setInfo(marker);
    if (onMarkerClick && marker.placeData) {
      onMarkerClick(marker.placeData as FireStation);
    }
  };

  return (
    <Map
      id="map"
      center={
        // 지도의 중심좌표, 사용자 위치로 변경하기
        center
      }
      style={{
        width: '100%',
        height: '100%',
      }}
      level={4}
      onCreate={setMap}
    >
      {/*현재 신고자 위치*/}
      {!isLoading && (
        <MapMarker
          position={center}
          image={{
            src: userMaker,
            size: { width: 64, height: 69 },
            options: { offset: { x: 27, y: 69 } },
          }}
          title="신고자 위치"
        />
      )}

      {/*소방서 위치*/}
      {markers.map((marker) => (
        <MapMarker // 마커를 생성
          key={`${marker.content}-${marker.position.lat},${marker.position.lng}`}
          position={marker.position}
          onClick={() => handleMarkerClick(marker)}
          image={{
            src: dispatchMarker,
            size: {
              width: 100,
              height: 100,
            }, // 마커이미지의 크기
            options: {
              offset: {
                x: 27,
                y: 69,
              }, // 마커이미지의 옵션
            },
          }}
        >
          {(info?.content === marker.content || selectedStation === marker.content) && (
            <div
              style={{
                position: 'relative', // 기본 인포윈도우 스타일 방지
                color: '#333',
                padding: '5px 12px',
                backgroundColor: 'white',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.3s ease-in-out',
              }}
            >
              🚑 {marker.content}
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 'normal',
                  marginTop: '1px',
                  textAlign: 'center',
                }}
              >
                {marker.distance} / {marker.eta}
              </div>
            </div>
          )}
        </MapMarker>
      ))}

      <MapTypeControl position={'TOPLEFT'} />
      <ZoomControl position={'LEFT'} />
    </Map>
  );
};
export default KakaoMaps;
