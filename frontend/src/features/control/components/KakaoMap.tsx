import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useKakaoLoader from '@/hooks/useKakaoLoader.ts';

interface FireStation {
    id: string;
    place_name: string;
    x: string;
    y: string;
}

const KakaoMaps = () => {
  const {fireStations}  = useKakaoLoader() as {fireStations: FireStation[]};

  return (
      <Map
          id="map"
          center={{
              lat: 33.450701,
              lng: 126.570667,
          }}
          style={{
              width: '100%',
              height: '100%',
          }}
          level={3}
      >
          {fireStations.map((station, index) => (
              <MapMarker
                  key={`${station.id}-${index}`}
                  position={{
                      lat: parseFloat(station.y),
                      lng: parseFloat(station.x)
                  }}
                  title={station.place_name}
              />
          ))}
      </Map>
  );
};
export default KakaoMaps;
