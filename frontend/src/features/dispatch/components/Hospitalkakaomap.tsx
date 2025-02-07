import { useState, useEffect } from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { KakaoMapProps } from '../types/hospital.types';

const HospitalKakaoMap = ({ FindHospitals }: KakaoMapProps) => {
  useKakaoLoader();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [info, setInfo] = useState<any | null>(null);
  const [state, setState] = useState({
    center: { lat: 33.450701, lng: 126.570667 },
    isLoading: true,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          });
        },
        (err) => {
          setState({
            center: { lat: 37.566826, lng: 126.9786567 },
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
      '응급실',
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const bounds = new kakao.maps.LatLngBounds();
          const newMarkers = data.map((place) => {
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
          FindHospitals && FindHospitals(data);
          map.setBounds(bounds);
        }
      },
      {
        location: new kakao.maps.LatLng(state.center.lat, state.center.lng),
        radius: 10000,
      }
    );
  }, [map, state.center]);

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

      {markers.map((marker) => (
        <MapMarker
          key={`${marker.content}-${marker.position.lat},${marker.position.lng}`}
          position={marker.position}
          onClick={() => setInfo(marker)}
          image={{
            src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
            size: {
              width: 64,
              height: 69,
            },
            options: {
              offset: {
                x: 27,
                y: 69,
              },
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

export default HospitalKakaoMap;
