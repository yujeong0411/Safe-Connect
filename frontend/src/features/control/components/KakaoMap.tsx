import { useState, useEffect } from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import useKakaoLoader from '@/hooks/useKakaoLoader.ts';
import { Marker, ExtendedKakaoMapProps, FireStation } from '@features/control/types/kakaoMap.types.ts';
import userMaker from '@assets/image/marker2.png'
import dispatchMarker from '@assets/image/119maker.png'
import {useLocationStore} from "@/store/location/locationStore.tsx";


const KakaoMaps = ({ FindFireStations, onMarkerClick, selectedStation }: ExtendedKakaoMapProps) => {
  useKakaoLoader();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [info, setInfo] = useState<Marker | null>(null);
  const {center, isLoading} = useLocationStore();

  // 위치 변경 감지를 위한 useEffect 추가
  useEffect(() => {
    console.log("==== 지도 위치 업데이트 ====");
    console.log("현재 중심 좌표:", center);
    console.log("로딩 상태:", isLoading);
    console.log("========================");
  }, [center, isLoading]);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          useLocationStore.getState().setLocation(newCenter.lat, newCenter.lng);
          useLocationStore.getState().setIsLoading(false);
        },
        () => {
          // 위치 기반 거부 시 서울 시청 설정
          useLocationStore.getState().setLocation(37.566826, 126.9786567)
          useLocationStore.getState().setIsLoading(false);
        }
      );
    }
  }, []);


  // 소방서 검색 로직
  useEffect(() => {
    if (!map) return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(
      '소방서',
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const bounds = new kakao.maps.LatLngBounds();

          // 안전센터를 제외한 소방서만 필터링
          const filteredData = data.filter(place =>
              !place.place_name.includes('안전센터') &&
              !place.place_name.includes('구조대')
          );

          const newMarkers: Marker[] = filteredData.map((place) => {
            const marker = {
              position: {
                lat: parseFloat(place.y),
                lng: parseFloat(place.x),
              },
              content: place.place_name,
              distance: place.distance, // 거리 정보
              placeData: place  // 원본 장소 데이터 저장
            };
            bounds.extend(new kakao.maps.LatLng(marker.position.lat, marker.position.lng));
            return marker;
          });

          setMarkers(newMarkers);

          // 소방서가 없을 수도 있다.
          if (FindFireStations) {
            FindFireStations(filteredData); // 검색된 소방서 정보 전달
          }
          map.setBounds(bounds);
        }
      },
      {
        location: new kakao.maps.LatLng(center.lat, center.lng),
        radius: 10000, // 10km 반경
      }
    );
  }, [map, center, FindFireStations]);


  // center가 변경될때마다 중심 이동
  useEffect(() => {
    if (map) {
      map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [map, center])

// 마커 클릭 시
  const handleMarkerClick = (marker: Marker) => {
    setInfo(marker)
    if (onMarkerClick && marker.placeData) {
      onMarkerClick(marker.placeData as FireStation);
    }
  }
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
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
              >
                🚑 {marker.content}
              </div>
          )}
        </MapMarker>
      ))}

      <MapTypeControl position={'TOPLEFT'}/>
      <ZoomControl position={'LEFT'}/>
    </Map>
  );
};
export default KakaoMaps;
