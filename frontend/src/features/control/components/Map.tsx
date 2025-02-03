import React, { useEffect, useRef } from 'react';
import { searchNearbyFireStations } from '@/utils/map';
import type { FireStation } from '@/types/kakao.maps';

interface MapProps {
    onStationsFound?: (stations: FireStation[]) => void;
}

const Map = ({ onStationsFound }: MapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("Map container:", mapContainer.current); // 디버깅용
        console.log("Kakao maps:", window.kakao?.maps); // kakao maps 객체 확인
        if (!mapContainer.current) return;
        if (!window.kakao?.maps) {
            console.error("Kakao maps SDK not loaded");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log("Current position:", lat, lng);

                const currentPos = new kakao.maps.LatLng(lat, lng);

                const options = {
                    center: currentPos,
                    level: 5
                };

                const map = new kakao.maps.Map(mapContainer.current, options);

                // 현재 위치 마커
                new kakao.maps.Marker({
                    position: currentPos,
                    map: map
                });

                try {
                    const nearbyStations = await searchNearbyFireStations(map, currentPos);
                    onStationsFound?.(nearbyStations);

                    nearbyStations.forEach(station => {
                        const marker = new kakao.maps.Marker({
                            position: new kakao.maps.LatLng(station.location.lat, station.location.lng),
                            map: map
                        });

                        const infowindow = new kakao.maps.InfoWindow({
                            content: `
                <div style="padding:5px;">
                  <strong>${station.place_name}</strong><br/>
                  거리: ${(station.distance/1000).toFixed(1)}km
                </div>
              `
                        });

                        kakao.maps.event.addListener(marker, 'click', () => {
                            infowindow.open(map, marker);
                        });
                    });
                } catch (error) {
                    console.error('Failed to search nearby fire stations:', error);
                }
            },
            (error) => {
                console.error("Failed to get location:", error);
            }
        );
    }, [onStationsFound]);

    return <div ref={mapContainer} className="h-full w-full rounded-lg" />;
};

export default Map;