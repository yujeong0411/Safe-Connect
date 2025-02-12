import { create } from 'zustand';

interface LocationState {
  center: {
    lat: number;
    lng: number;
  };
  isLoading: boolean;
  setLocation: (lat: number, lng: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  center: { lat: 37.566826, lng: 126.9786567 }, // 서울시청 좌표 (기본값)
  isLoading: true,
  setLocation: (lat: number, lng: number) =>
    set({ center: { lat, lng }, isLoading: false }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));