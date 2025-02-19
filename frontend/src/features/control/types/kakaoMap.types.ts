export interface Marker {
    position: {
        lat: number;
        lng: number;
    };
    content: string;
    distance?:string;
    placeData?:any
    eta:any
}

export interface KakaoMapProps {
    FindFireStations?: (stations: any[]) => void
}

export interface FireStation {
    place_name: string;
    distance: string;
    eta: any

    // kakao places API에서 제공하는 다른 필요한 필드들
    id: string;
    x: string;
    y: string;
}

export interface ExtendedKakaoMapProps extends KakaoMapProps {
    onMarkerClick?: (station:FireStation) => void;
    selectedStation?: string | null;
}