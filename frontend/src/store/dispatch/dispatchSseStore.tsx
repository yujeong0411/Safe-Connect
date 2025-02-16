import { create } from 'zustand';
import { useDispatchAuthStore } from './dispatchAuthStore';
import { DispatchOrderResponse } from '@/types/dispatch/dispatchOrderResponse.types';
import { useDispatchPatientStore } from './dispatchPatientStore';
import { AcceptedHospitalResponse, TransferRequestResponse } from '@/types/dispatch/dispatchTransferResponse.types';
// import { useState } from 'react';

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
}

// 출동 지령
const handleDispatchOrder = (event: MessageEvent) => {
  try {
    const response: DispatchOrderResponse = JSON.parse(event.data);
    if (response.isSuccess) {
      useDispatchPatientStore.getState().setPatientFromSSE(response.data);
      console.log("dispatch-order response", response);
    }
  } catch (error) {
    console.error("SSE 에러: ", error);
  }
}

// 병원 이송
const handleTransferRequest = (event: MessageEvent) => {
  try {
    const response: TransferRequestResponse = JSON.parse(event.data);
    console.log("transfer-request", response)
  } catch (error) {
    console.log("SSE 에러: ", error);
  }
}

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
        console.log("hospital-response", hospitalData);
        useDispatchSseStore.getState().setAcceptedHospital(hospitalData);
      };
  } catch (error) {
    console.log("SSE 에러", error);
  }
}


// 핸들러 등록
const dispatchSseEventHandlers = {
  "dispatch-order": handleDispatchOrder,
  "transfer-request": handleTransferRequest,
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

  startReconnectTimer: () => {
    const currentTimer = get().reconnectTimer;
    if (currentTimer) {
      clearTimeout(currentTimer);
    }

    // 25분(1500000ms) 후에 재연결
    const timer = setTimeout(() => {
      const { userName } = useDispatchAuthStore.getState();
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
        `${subscribeUrl}/dispatchGroup/subscribe?clientId=${clientId}`,
        { withCredentials: true }
      );

      // 각 이벤트 타입에 대한 핸들러 등록
      Object.entries(dispatchSseEventHandlers).forEach(([eventName, handler]) => {
        newEventSource.addEventListener(eventName, handler);
      });

      newEventSource.onopen = () => {
        console.log("SSE 연결 성공");
        set({ sseConnected: true, retryCount: 0 });
        get().startReconnectTimer();
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
      // 등록된 모든 이벤트 리스너 제거
      Object.entries(dispatchSseEventHandlers).forEach(([eventName, handler]) => {
        currentEventSource.removeEventListener(eventName, handler);
      });

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

  // 사용자가 로그인했는데 SSE 연결되지 않았을 때, 자동으로 연결 시도
  ensureConnection: () => {
    const { userName, isAuthenticated } = useDispatchAuthStore.getState();
    if (isAuthenticated && userName && !get().sseConnected) {
      get().connect(userName);
    }
  }
}));