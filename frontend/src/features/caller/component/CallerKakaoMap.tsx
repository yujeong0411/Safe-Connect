import { useState, useEffect } from 'react';
import { CustomOverlayMap, Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import { callerService } from '@/features/caller/services/callerApiService.ts';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { Aed } from '@/types/common/aed.types.ts';

const CallerKakaoMap = () => {
  useKakaoLoader();
  const [state, setState] = useState({
    center: { lat: 33.450701, lng: 126.570667 },
    isLoading: true,
  });
  const [aedList, setAedList] = useState<Aed[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const fetchAedLocations = async (lat: number, lng: number) => {
    try {
      const response = await callerService.searchAed(lat, lng);
      setAedList(response.data);
    } catch (error) {
      console.error('AED 위치 조회 실패:', error);
    }
  };

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
          fetchAedLocations(newCenter.lat, newCenter.lng);
        },
        () => {
          setState({
            center: { lat: 37.566826, lng: 126.9786567 }, // 서울시청 좌표 (기본값)
            isLoading: false,
          });

        }
      );
    }
  }, []);

  return (
    <Map
      id="map"
      center={state.center}
      style={{
        width: '100%',
        height: '100%',
      }}
      level={5}
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

      {/* AED 위치 마커들 */}
      {aedList.map((aed) => (
        <div key={aed.aedId}>
          <CustomOverlayMap
            position={{ lat: aed.aedLatitude, lng: aed.aedLongitude }}
          >
            <div
              className="relative cursor-pointer"
              onClick={() => setSelectedMarker(aed.aedId)}
            >
              <div className="w-10 h-10 rounded-full bg-red-500 border-2 border-white shadow-lg overflow-hidden flex items-center justify-center">
                <img
                  src="src/assets/image/aed.jpg"
                  alt="AED"
                  className="w-8 h-8 object-cover rounded-full"
                />
              </div>
            </div>
          </CustomOverlayMap>

          {/* 선택된 마커의 정보 창 */}
          {selectedMarker === aed.aedId && (
            <CustomOverlayMap
              position={{ lat: aed.aedLatitude, lng: aed.aedLongitude }}
              yAnchor={1.5}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold mb-2">{aed.aedPlace}</h3>
                <p className="text-sm text-gray-600">{aed.aedAddress}</p>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarker(null);
                  }}
                >
                  ✕
                </button>
              </div>
            </CustomOverlayMap>
          )}
        </div>
      ))}

      <MapTypeControl position={'TOPLEFT'} />
      <ZoomControl position={'LEFT'} />
    </Map>
  );
};

export default CallerKakaoMap;