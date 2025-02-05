declare global {
  interface Window {
    kakao: any;
  }
}

export interface FireStation {
  id: string;
  place_name: string;
  distance: number;
  location: {
    lat: number;
    lng: number;
  };
  address_name: string;
  phone: string;
}

export {};
