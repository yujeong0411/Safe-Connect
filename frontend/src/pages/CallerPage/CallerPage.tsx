import { useOpenViduStore } from '@/store/openvidu/OpenViduStore';
import CallerTemplate from '@features/caller/component/CallerTemplate.tsx';
import { useEffect, useRef, useState } from 'react';

interface shareLocationResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  name: string;
  data: {
    callId: number;
    dispatchGroupId: number;
    dispatchGroupLatitude: number;
    dispatchGroupLongitude: number;
  }
}


const CallerPage = () => {  
  const { sessionId } = useOpenViduStore();
  const [sseConnected, setSseConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RETRIES = 5;
  const INITIAL_RETRY_DELAY = 1000;
  const RECONNECT_INTERVAL = 1500000; // 25분


  // SSE 연결 관련
  const connectSSE = () => {
    if (sseConnected && eventSourceRef.current) {
      console.log("SSE already connnected")
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
        console.log("구급차 위치 공유 데이터", response);
      });

      newEventSource.onopen = () => {
        console.log("SSE 연결 성공");
        setSseConnected(true);
        setRetryCount(0);
        startReconnectTimer();
      };

      newEventSource.onerror = (error) => {
        console.error("SSE 연결 에러: ", error)

        if (retryCount < MAX_RETRIES) {
          const nextRetryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          console.log(`${nextRetryDelay}ms 후 재시도... (${retryCount + 1}/${MAX_RETRIES})`);

          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            connectSSE();
          }, nextRetryDelay);
        } else {
          console.log("최대 재시도 횟수 도달, 연결 종료");
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
      console.log("예약된 재연결 시작");
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
    // 자주 재연결되는 것을 막기 위헤 조건에 !sseConnected 추가 (이미 연결된 상태면 추가 요청 하지 않도록)
    if (sessionId && !sseConnected) {
      connectSSE();
    } else {
      console.log("현재 신고 내역이 없습니다.");
    }

    return () => {
      disconnect();
    };
  }, [sessionId, sseConnected]);


  return (
    <CallerTemplate>

    </CallerTemplate>
  );
};

export default CallerPage;