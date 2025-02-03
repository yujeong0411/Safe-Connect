import React from 'react';
import { FireStation } from '@/types/kakao.maps';

interface FireStationListProps {
    stations: FireStation[];
    selectedStation: FireStation | null;
    onSelectStation: (station: FireStation) => void;
}

const FireStationList = ({ stations, selectedStation, onSelectStation }: FireStationListProps) => {
    return (
        <div className="w-96 bg-white/90 backdrop-blur-sm shadow-lg p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">인근 소방서 목록</h2>
            {stations.map(station => (
                <div
                    key={station.id}
                    className={`p-4 mb-4 rounded-lg border cursor-pointer transition-colors
            ${selectedStation?.id === station.id
                        ? 'bg-rose-50 border-rose-200'
                        : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => onSelectStation(station)}
                >
                    <h3 className="font-semibold">{station.place_name}</h3>
                    <div className="mt-2 text-sm space-y-1">
                        <div className="flex justify-between">
                            <span>거리</span>
                            <span className="font-medium">{(station.distance/1000).toFixed(1)}km</span>
                        </div>
                        <div className="flex justify-between">
                            <span>주소</span>
                            <span className="font-medium">{station.address_name}</span>
                        </div>
                        {station.phone && (
                            <div className="flex justify-between">
                                <span>전화번호</span>
                                <span className="font-medium">{station.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FireStationList;