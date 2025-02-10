import { useEffect, useRef } from "react";
import { BaseResponse } from "@/types/sse/sse.types";

interface UseSSEProps<T> {
    subscribeUrl: string;
    clientId: number;
    onMessage: (data: BaseResponse<T>) => void;
    onError?: (error: any) => void;
}

export const useSSE = <T, >({ subscribeUrl, clientId, onMessage, onError }: UseSSEProps<T>) => {
    const eventSourceRef = useRef<EventSource | null>(null);

    // 컴포넌트가 렌더링될 때 실행되는 함수
    useEffect(() => {
        // SSE 연결
        const connect = () => {
          // 기존 연결이 있다면 닫기
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }
    
          // URL에 clientId 추가
          const url = `${subscribeUrl}?clientId=${clientId}`; // SSE 서버로 연결할 URL
          // EventSource 객체 생성(<= 이 객체가 실제로 서버와 연결을 맺고, 실시간으로 데이터를 받음)
          const eventSource = new EventSource(url);
    
          // 서버에서 메시지를 받으면 호출되는 이벤트 핸들러
          eventSource.onmessage = (event) => {
            try {
              const data: BaseResponse<T> = JSON.parse(event.data); // event.data: 서버로부터 받은 메시지를 포함
              onMessage(data);
            } catch (error) {
              console.error('Failed to parse SSE message:', error);
            }
          };
    
          eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            if (onError) {
              onError(error);
            }
            eventSource.close();
            // 재연결 시도
            setTimeout(connect, 5000);
          };
    
          eventSourceRef.current = eventSource;
        };
    
        // useEffect가 실행되면 connect 함수 호출해서 SSE 연결
        connect();
    
        // 컴포넌트 언마운트 시 연결 종료
        return () => {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }
        };
      }, [subscribeUrl, clientId, onMessage, onError]); // 이 배열에 있는 값이 변경될 때마다 useEffect 다시 실행
    };