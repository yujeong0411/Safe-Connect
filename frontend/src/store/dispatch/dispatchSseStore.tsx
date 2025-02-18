import { create } from 'zustand';
import { useDispatchAuthStore } from './dispatchAuthStore';
import { DispatchOrderResponse } from '@/types/dispatch/dispatchOrderResponse.types';
import { useDispatchPatientStore } from './dispatchPatientStore';
import { AcceptedHospitalResponse } from '@/types/dispatch/dispatchTransferResponse.types';
import { useOpenViduStore } from '../openvidu/OpenViduStore';


interface DispatchSSEState {
  eventSource: EventSource | null;
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

  acceptedHospital: {
    transferId: number;
    hospitalId: number;
    hospitalName: string;
    latitude: number;
    longitude: number;
  } | null;
  setAcceptedHospital: (data: {
    transferId: number;
    hospitalId: number;
    hospitalName: string;
    latitude: number;
    longitude: number;
  } | null) => void;


  currentCallId: number | null;
  setCurrentCallId: (callId: number | null) => void;
  // 페이지 바뀔때마다 응답이 새로 오는 부분 수정하려고
  notificationStatus: {
    [callId: number]: {
      shown: boolean;
    };
  };
  setNotificationShown: (callId: number) => void;
  hasNotificationBeenShown: (callId: number) => boolean;
  resetNotificationStatus: (callId: number) => void;
}

// 출동 지령
const handleDispatchOrder = (event: MessageEvent) => {
  try {
    const response: DispatchOrderResponse = JSON.parse(event.data);
    if (response.isSuccess) {
      const callId = response.data.call.callId;

      // useDispatchPatientStore.getState().setPatientFromSSE(response.data);
      useDispatchPatientStore.getState().setPatientFromSSE({
        ...response.data,
        callerLocation: response.data.callerLocation
      })
      useDispatchSseStore.getState().setCurrentCallId(callId);

      // sessionId 부분 추가
      const sessionId = response.data.sessionId;
      if (sessionId) {
        const openViduStore = useOpenViduStore.getState();
        openViduStore.handleChangeSessionId({
          target: { value: sessionId }
        } as React.ChangeEvent<HTMLInputElement>);
        openViduStore.joinSession();
      }

    }
  } catch (error) {
    console.error("SSE 에러: ", error);
  }
}

// 병원 이송은 이송 요청 페이지에서 핸들러 등록
// // 병원 이송
// const handleTransferRequest = (event: MessageEvent) => {
//   try {
//     const response: TransferRequestResponse = JSON.parse(event.data);
//   } catch (error) {
//   }
// }

// 병원이 이송 요청 수락
const handleHospitalResponse = (event: MessageEvent) => {
  try {
    const response: AcceptedHospitalResponse = JSON.parse(event.data);
    if (response.isSuccess) {
        const hospitalData = {
          transferId: response.data.transferId,
          hospitalId: response.data.hospitalId,
          hospitalName: response.data.hospitalName,
          latitude: response.data.latitude,
          longitude: response.data.longitude
        }
        useDispatchSseStore.getState().setAcceptedHospital(hospitalData);
      };
  } catch (error) {
    console.error("SSE 에러", error);
  }
}


// 핸들러 등록
const dispatchSseEventHandlers = {
  "dispatch-order": handleDispatchOrder,
  // "transfer-request": handleTransferRequest,
  "hospital-response": handleHospitalResponse,
}


export const useDispatchSseStore = create<DispatchSSEState>((set, get) => ({
  eventSource: null,
  sseConnected: false,
  reconnectTimer: null,
  retryCount: 0,
  maxRetries: 5,
  retryDelay: 1000,

  acceptedHospital: null,
  setAcceptedHospital: (data) => set({ acceptedHospital: data }),

  currentCallId: null,
  setCurrentCallId: (callId) => set({ currentCallId: callId }),

  notificationStatus: {},
  setNotificationShown: (callId: number) => {
    set((state) => ({
      notificationStatus: {
        ...state.notificationStatus,
        [callId]: {
          shown: true
        }
      }
    }));
  },

  hasNotificationBeenShown: (callId: number) => {
    const status = get().notificationStatus[callId];
    return status?.shown || false;
  },

  resetNotificationStatus: (callId: number) => {
    set((state) => {
      const { [callId]: _, ...rest } = state.notificationStatus;
      return { notificationStatus: rest };
    });
  },

  startReconnectTimer: () => {
    const currentTimer = get().reconnectTimer;
    if (currentTimer) {
      clearTimeout(currentTimer);
    }

    // 25분(1500000ms) 후에 재연결
    const timer = setTimeout(() => {
      const { userName } = useDispatchAuthStore.getState();
      if (userName) {
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
        `${subscribeUrl}/dispatchGroup/subscribe?clientId=${clientId}`,
        { withCredentials: true }
      );

      // 각 이벤트 타입에 대한 핸들러 등록
      Object.entries(dispatchSseEventHandlers).forEach(([eventName, handler]) => {
        newEventSource.addEventListener(eventName, handler);
      });

      newEventSource.onopen = () => {
        set({ sseConnected: true, retryCount: 0 });
        get().startReconnectTimer();
      };

      newEventSource.onerror = (error) => {
        console.error("SSE Connection error:", error);
        const { retryCount, maxRetries, retryDelay } = get();

        if (retryCount < maxRetries) {
          const nextRetryDelay = retryDelay * Math.pow(2, retryCount);
          setTimeout(() => {
            set({ retryCount: retryCount + 1 });
            get().connect(clientId);
          }, nextRetryDelay);
        } else {
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
      // 등록된 모든 이벤트 리스너 제거
      Object.entries(dispatchSseEventHandlers).forEach(([eventName, handler]) => {
        currentEventSource.removeEventListener(eventName, handler);
      });

      currentEventSource.close();
      set({
        eventSource: null,
        sseConnected: false,
        retryCount: 0,
        notificationStatus: {}, // 알림 상태 초기화
        currentCallId: null,
      });
      get().clearReconnectTimer(); // 연결 해제시 재연결 타이머 정리
    }
  },

  // 사용자가 로그인했는데 SSE 연결되지 않았을 때, 자동으로 연결 시도
  ensureConnection: () => {
    const { userName, isAuthenticated } = useDispatchAuthStore.getState();
    if (isAuthenticated && userName && !get().sseConnected) {
      get().connect(userName);
    }
  }
}));