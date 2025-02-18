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
  reconnectTimer: NodeJS.Timeout | null;  // 재연결 타이머
  connect: (clientId: string) => void;
  disconnect: () => void;
  ensureConnection: () => void;
  startReconnectTimer: () => void;  // 타이머 시작
  clearReconnectTimer: () => void;  // 타이머 정리
  retryCount: number;
  maxRetries: number;
  retryDelay: number;
}

export const useControlsseStore = create<SSEState>((set, get) => ({
  eventSource: null,
  sseConnected: false,
  callerLocation: null,
  reconnectTimer: null,
  retryCount: 0,
  maxRetries: 5,
  retryDelay: 1000,

  startReconnectTimer: () => {
    const currentTimer = get().reconnectTimer;
    if (currentTimer) {
      clearTimeout(currentTimer);
    }

    // 25분(1500000ms) 후에 재연결
    const timer = setTimeout(() => {
      const { userName } = useControlAuthStore.getState();
      if (userName) {
        console.log("Scheduled reconnection starting...");
        get().disconnect();
        get().connect(userName);
      }
    }, 1500000);

    set({ reconnectTimer: timer });
  },

  clearReconnectTimer: () => {
    const currentTimer = get().reconnectTimer;
    if (currentTimer) {
      clearTimeout(currentTimer);
      set({ reconnectTimer: null });
    }
  },

  connect: (clientId: string) => {
    if (get().sseConnected && get().eventSource) {
      console.log("Already connected");
      return;
    }

    const currentEventSource = get().eventSource;
    if (currentEventSource) {
      currentEventSource.close();
    }

    let subscribeUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    if (subscribeUrl !== "http://localhost:8080") {
      subscribeUrl += "/api";
    }

    try {
      const newEventSource = new EventSource(
        `${subscribeUrl}/control/subscribe?clientId=${clientId}`,
        { withCredentials: true }
      );

      newEventSource.addEventListener('connect', (event) => {
        console.log("SSE Connected:", event);
        set({ sseConnected: true, retryCount: 0 });
        // 연결 성공시 재연결 타이머 시작
        get().startReconnectTimer();
      });

      newEventSource.addEventListener('heartbeat', () => {
      });

      newEventSource.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          if (response.isSuccess && response.data) {
            // callerLocation 상태 업데이트
            set({ callerLocation: response.data });

            // locationStore 업데이트
            const locationStore = useLocationStore.getState();
            locationStore.setLocation(response.data.lat, response.data.lng);
            locationStore.setIsEmergencyCall(true); // 위치 데이터를 받았을 때 신고 상태로 설정

            console.log("Location updated:", response.data); //

          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      newEventSource.onerror = (error) => {
        console.error("SSE Connection error:", error);
        const { retryCount, maxRetries, retryDelay } = get();

        if (retryCount < maxRetries) {
          const nextRetryDelay = retryDelay * Math.pow(2, retryCount);
          console.log(`Retrying in ${nextRetryDelay}ms... (${retryCount + 1}/${maxRetries})`);

          setTimeout(() => {
            set({ retryCount: retryCount + 1 });
            get().connect(clientId);
          }, nextRetryDelay);
        } else {
          console.log("Max retries reached, closing connection");
          newEventSource.close();
          set({
            eventSource: null,
            sseConnected: false,
            retryCount: 0
          });
          // 연결 실패시 재연결 타이머 정리
          get().clearReconnectTimer();
        }
      };

      set({ eventSource: newEventSource });
    } catch (error) {
      console.error("Error creating EventSource:", error);
    }
  },

  disconnect: () => {
    const currentEventSource = get().eventSource;
    if (currentEventSource) {
      currentEventSource.close();
      set({
        eventSource: null,
        sseConnected: false,
        retryCount: 0
      });
      // 연결 해제시 재연결 타이머 정리
      get().clearReconnectTimer();
    }
  },

  ensureConnection: () => {
    const { userName, isAuthenticated } = useControlAuthStore.getState();
    if (isAuthenticated && userName && !get().sseConnected) {
      get().connect(userName);
    }
  }
}));