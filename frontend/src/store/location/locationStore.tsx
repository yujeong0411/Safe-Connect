import { create } from 'zustand';
import { axiosInstance } from '@utils/axios.ts';

interface LocationState {
  center: {
    lat: number;
    lng: number;
  };
  controllerLocation: {  // 관제사의 현재 위치
    lat: number;
    lng: number;
  };
  address: string;
  isEmergencyCall: boolean;  // 신고 통화 중인지 여부
  setIsEmergencyCall: (isCall: boolean) => void;
  setAddress: (address: string) => void;
  isLoading: boolean;
  setLocation: (lat: number, lng: number) => void;
  setControllerLocation: (lat: number, lng: number) => void;
  setIsLoading: (loading: boolean) => void;
  fetchUserLocation: () => void;
  sendUserLocation: (lat: number, lng: number, sessionId: string) => void;
  resetToControllerLocation: () => void;  // 관제사 위치로 초기화
}

export const useLocationStore = create<LocationState>((set) => ({
  center: { lat: 37.566826, lng: 126.9786567 },
  controllerLocation: { lat: 37.566826, lng: 126.9786567 },
  isEmergencyCall: false,
  isLoading: true,
  address: '',

  setIsEmergencyCall: (isCall: boolean) =>
    set({ isEmergencyCall: isCall }),

  setLocation: (lat: number, lng: number) =>
    set({ center: { lat, lng }, isLoading: false }),

  setControllerLocation: (lat: number, lng: number) =>
    set({ controllerLocation: { lat, lng } }),

  setIsLoading: (loading: boolean) =>
    set({ isLoading: loading }),

  setAddress: (address: string) =>
    set(() => ({ address })),

  fetchUserLocation: () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          set({
            center: { lat, lng },
            controllerLocation: { lat, lng },
            isLoading: false,
          });
        },
        () => {
          set({
            center: { lat: 37.566826, lng: 126.9786567 },
            controllerLocation: { lat: 37.566826, lng: 126.9786567 },
            isLoading: false
          });
        }
      );
    }
  },

  resetToControllerLocation: () => {
    set((state) => ({
      center: state.controllerLocation,
      isEmergencyCall: false
    }));
  },

  sendUserLocation: async (lat: number, lng: number, sessionId: string) => {
    try {
      const response = await axiosInstance.post(
        '/user/location',
        {
          lat,
          lng,
          sessionId
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}));