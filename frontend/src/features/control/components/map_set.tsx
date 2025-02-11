import { useState, useEffect } from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import useKakaoLoader from '@/hooks/useKakaoLoader.ts';
import { Marker, KakaoMapProps } from '@features/control/types/kakaoMap.types.ts';
import userMaker from '@assets/image/marker2.png';
import dispatchMarker from '@assets/image/119maker.png';
import callerMarker from '@assets/image/caller-marker.png';  // 신고자용 마커 이미지

const KakaoMaps = ({ FindFireStations }: KakaoMapProps) => {
    useKakaoLoader();
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [info, setInfo] = useState<Marker | null>(null);
    const [callerLocation, setCallerLocation] = useState<{lat: number; lng: number} | null>(null);
    const [state, setState] = useState({
        center: { lat: 33.450701, lng: 126.570667 },
        isLoading: true,
    });

    // 신고자 위치 정보 업데이트 함수
    // const updateCallerLocation = (lat: number, lng: number) => {
    //     setCallerLocation({ lat, lng });
    //     if (map) {
    //         // 지도 중심을 신고자 위치로 이동
    //         map.setCenter(new kakao.maps.LatLng(lat, lng));
    //
    //         // 소방서 재검색
    //         searchNearbyFireStations(lat, lng);
    //     }
    // };

    // 주변 소방서 검색 함수
    const searchNearbyFireStations = (lat: number, lng: number) => {
        if (!map) return;

        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(
            '소방서',
            (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const bounds = new kakao.maps.LatLngBounds();
                    const newMarkers: Marker[] = data.map((place) => {
                        const marker = {
                            position: {
                                lat: parseFloat(place.y),
                                lng: parseFloat(place.x),
                            },
                            content: place.place_name,
                            distance: place.distance,
                        };
                        bounds.extend(new kakao.maps.LatLng(marker.position.lat, marker.position.lng));
                        return marker;
                    });

                    setMarkers(newMarkers);
                    if (FindFireStations) {
                        FindFireStations(data);
                    }

                    // 신고자 위치도 bounds에 포함
                    if (callerLocation) {
                        bounds.extend(new kakao.maps.LatLng(callerLocation.lat, callerLocation.lng));
                    }
                    map.setBounds(bounds);
                }
            },
            {
                location: new kakao.maps.LatLng(lat, lng),
                radius: 10000,
            }
        );
    };

    // 초기 현재 위치 가져오기
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

    // 소방서 검색
    useEffect(() => {
        if (!map) return;
        searchNearbyFireStations(state.center.lat, state.center.lng);
    }, [map, state.center]);

    return (
        <Map
            id="map"
            center={callerLocation || state.center}
            style={{
                width: '100%',
                height: '100%',
            }}
            level={4}
            onCreate={setMap}
        >
            {/* 현재 내 위치 마커 */}
            {!state.isLoading && (
                <MapMarker
                    position={state.center}
                    image={{
                        src: userMaker,
                        size: { width: 64, height: 69 },
                        options: { offset: { x: 27, y: 69 } },
                    }}
                    title="현재 위치"
                />
            )}

            {/* 신고자 위치 마커 */}
            {callerLocation && (
                <MapMarker
                    position={callerLocation}
                    image={{
                        src: callerMarker,
                        size: { width: 64, height: 69 },
                        options: { offset: { x: 27, y: 69 } },
                    }}
                    title="신고자 위치"
                />
            )}

            {/* 소방서 마커들 */}
            {markers.map((marker) => (
                <MapMarker
                    key={`${marker.content}-${marker.position.lat},${marker.position.lng}`}
                    position={marker.position}
                    onClick={() => setInfo(marker)}
                    image={{
                        src: dispatchMarker,
                        size: { width: 64, height: 69 },
                        options: { offset: { x: 27, y: 69 } },
                    }}
                >
                    {info && info.content === marker.content && (
                        <div style={{ color: '#000' }}>{marker.content}</div>
                    )}
                </MapMarker>
            ))}

            <MapTypeControl position={'TOPLEFT'} />
            <ZoomControl position={'LEFT'} />
        </Map>
    );
};

export default KakaoMaps;