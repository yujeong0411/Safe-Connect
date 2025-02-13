// store/control/controlsseStore.ts
import { create } from 'zustand';
import { useControlAuthStore } from './controlAuthStore';
import { useLocationStore } from '@/store/location/locationStore.tsx';

interface LocationData {
  lat: number;
  lng: number;
  sessionId: string;
}
interface SSEState {
  eventSource: EventSource | null;
  callerLocation: LocationData | null;
  sseConnected: boolean;
  connect: (clientId: string) => void;
  disconnect: () => void;
  ensureConnection: () => void;
}

export const useControlsseStore = create<SSEState>((set, get) => ({
  eventSource: null,
  sseConnected: false,
  callerLocation: null,

  connect: (clientId: string) => {
    // 이미 연결되어 있다면 중복 연결 방지
    if (get().sseConnected) return;

    const currentEventSource = get().eventSource;
    if (currentEventSource) {
      currentEventSource.close();
    }

    let subscribeUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    if (subscribeUrl !== "http://localhost:8080") {
      subscribeUrl += "/api"
    }

    const newEventSource = new EventSource(`${subscribeUrl}/control/subscribe?clientId=${clientId}`);

    newEventSource.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if(response.isSuccess && response.data) {
        useLocationStore.getState().setLocation(response.data.lat, response.data.lng);
      }
      console.log("SSE data: ", response);
    };

    newEventSource.onerror = (error) => {
      console.error("SSE Connection error: ", error);
      newEventSource.close();
      set({ eventSource: null, sseConnected: false });
    };

    set({ eventSource: newEventSource, sseConnected: true });
  },

  disconnect: () => {
    const currentEventSource = get().eventSource;
    if (currentEventSource) {
      currentEventSource.close();
      set({ eventSource: null, sseConnected: false});
    }
  },

  // 로그인 상태 확인 후 필요시 SSE 연결을 수행하는 함수
  ensureConnection: () => {
    const { userName, isAuthenticated } = useControlAuthStore.getState();

    if (isAuthenticated && userName && !get().sseConnected) {
      get().connect(userName);
    }
  }
}));