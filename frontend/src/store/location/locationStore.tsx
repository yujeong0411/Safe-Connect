import { create } from 'zustand';

interface LocationState {
  center: {
    lat: number;
    lng: number;
  };
  isLoading: boolean;
  setLocation: (lat: number, lng: number) => void;
  setIsLoading: (loading: boolean) => void;
  fetchUserLocation: (lat: number, lng: number) => void;  // 위치 가져오는 함수
}

export const useLocationStore = create<LocationState>((set) => ({
  center: { lat: 37.566826, lng: 126.9786567 }, // 서울시청 좌표 (기본값)
  isLoading: true,
  setLocation: (lat: number, lng: number) =>
    set({ center: { lat, lng }, isLoading: false }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  fetchUserLocation: () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            set({
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              isLoading: false,
            });
          },
          () => {
            // 위치 거부 시 서울시청으로 설정
            set({ center: { lat: 37.566826, lng: 126.9786567 }, isLoading: false });
          }
      );
    }
  },
}));