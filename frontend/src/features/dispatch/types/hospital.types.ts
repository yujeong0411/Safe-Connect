export interface Hospital {
    id: string;
    place_name: string;
    distance: string;
    x: string;
    y: string;
  }
  
  export interface KakaoMapProps {
    FindHospitals?: (hospitals: any[]) => void;
  }
  