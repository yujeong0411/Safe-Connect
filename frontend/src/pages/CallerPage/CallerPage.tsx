import { useOpenViduStore } from '@/store/openvidu/OpenViduStore';
import CallerTemplate from '@features/caller/component/CallerTemplate.tsx';
import { useEffect, useRef, useState } from 'react';
import { useAmbulanceLocationStore } from '@/store/caller/ambulanceLocationStore';


interface shareLocationResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  name: string;
  data: {
  sessionId: string;
  lng:number;
  lat:number;
  }
}


const CallerPage = () => {  
  const { sessionId } = useOpenViduStore();
  const [sseConnected, setSseConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevSessionIdRef = useRef<String | null>(null);

  const MAX_RETRIES = 5;
  const INITIAL_RETRY_DELAY = 1000;
  const RECONNECT_INTERVAL = 1500000; // 25분


  // SSE 연결 관련
  const connectSSE = () => {
    if (sseConnected && eventSourceRef.current) {
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    let subscribeUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    if (subscribeUrl !== "http://localhost:8080") {
      subscribeUrl += "/api"
    }

    try {
      const newEventSource = new EventSource(`${subscribeUrl}/caller/subscribe?clientId=${sessionId}`,
        { withCredentials: true }
      )
      newEventSource.addEventListener("ambulanceLocation-shared", (event) => {
        const response: shareLocationResponse = JSON.parse(event.data);

        if (response.isSuccess && response.data) {
          useAmbulanceLocationStore.getState().setLocation({
            sessionId: response.data.sessionId,
            lat: response.data.lat,
            lng: response.data.lng
          });
        }
      });

      newEventSource.onopen = () => {
        setSseConnected(true);
        setRetryCount(0);
        startReconnectTimer();
      };

      newEventSource.onerror = (error) => {
        console.error("SSE 연결 에러: ", error);
        setSseConnected(false);

        if (retryCount < MAX_RETRIES) {
          const nextRetryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            connectSSE();
          }, nextRetryDelay);
        } else {
          disconnect();
        }
      };
      
      eventSourceRef.current = newEventSource;
    } catch (error) {
      console.error("EventSource 생성 중 에러 발생: ", error);
    }
  };

  const startReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    reconnectTimerRef.current = setTimeout(() => {
      disconnect();
      connectSSE();
    }, RECONNECT_INTERVAL);
  }

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    setSseConnected(false);
    setRetryCount(0);
  }


  useEffect(() => {
    if (sessionId) {
      connectSSE();
    }

    // 세션 아이디가 변경된 경우에만 재연결
    if (prevSessionIdRef.current !== sessionId) {
      disconnect();
      connectSSE();
    }

    return () => {
      disconnect();
    };
  }, [sessionId]);


  return (
    <CallerTemplate>

    </CallerTemplate>
  );
};

export default CallerPage;