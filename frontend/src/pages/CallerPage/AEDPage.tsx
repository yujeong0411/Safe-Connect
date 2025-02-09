import { useState, useEffect } from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import useKakaoLoader from '@/hooks/useKakaoLoader.ts';
import {Marker, KakaoMapProps} from "@features/control/types/kakaoMap.types.ts";

const AEDPage = ({FindFireStations}:KakaoMapProps) => {
    useKakaoLoader();
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [info, setInfo] = useState<Marker | null>(null);
    const [state, setState] = useState({
        center: { lat: 33.450701, lng: 126.570667 },
        isLoading: true,
    });

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
                (_) => {
                    setState({
                        center: { lat: 37.566826, lng: 126.9786567 }, // 기본 서울 중심
                        isLoading: false,
                    });
                }
            );
        }
    }, []);

    useEffect(() => {
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
                            distance:place.distance,  // 거리 정보
                        };
                        bounds.extend(new kakao.maps.LatLng(marker.position.lat, marker.position.lng));
                        return marker;
                    });

                    setMarkers(newMarkers);
                    FindFireStations(data);  // 검색된 소방서 정보 전달
                    map.setBounds(bounds);
                }
            },
            {
                location: new kakao.maps.LatLng(state.center.lat, state.center.lng),
                radius: 10000, // 10km 반경
            }
        );
    }, [map, state.center]);

    return (
        <Map
            id="map"
            center={
                // 지도의 중심좌표, 사용자 위치로 변경하기
                state.center
            }
            style={{
                width: '100%',
                height: '100%',
            }}
            level={4}
            onCreate={setMap}
        >
            {/*현재 내위치*/}
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

            {/*소방서 위치*/}
            {markers.map((marker) => (
                <MapMarker // 마커를 생성합니다
                    key={`${marker.content}-${marker.position.lat},${marker.position.lng}`}
                    position={marker.position}
                    onClick={() => setInfo(marker)}
                    image={{
                        src: 'https://cdn.crowdpic.net/detail-thumb/thumb_d_95A0D99CD45AEE995519614F9B67AD41.png', // 마커이미지의 주소입니다
                        size: {
                            width: 64,
                            height: 69,
                        }, // 마커이미지의 크기입니다
                        options: {
                            offset: {
                                x: 27,
                                y: 69,
                            }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                        },
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
export default AEDPage;
