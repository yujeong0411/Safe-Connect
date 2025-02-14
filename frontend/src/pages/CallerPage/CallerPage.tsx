import { useOpenViduStore } from '@/store/openvidu/OpenViduStore';
import CallerTemplate from '@features/caller/component/CallerTemplate.tsx';
import { useEffect } from 'react';

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
  
  useEffect(() => {

    console.log("현재 sessionId = ", sessionId)
    
    let subscribeUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    if (subscribeUrl !== "http://localhost:8080") {
      subscribeUrl += "/api"
    }
  
    if (!sessionId) {
      console.log("현재 신고 내역이 없습니다.")
      // return;
    }
  
    // SSE 연결
    const eventSource = new EventSource(`${subscribeUrl}/caller/subscribe?clientId=${sessionId}`);
    
    eventSource.onopen = () => {
      console.log("SSE 연결!")
    }
  
    eventSource.addEventListener("ambulance location shared!", (event) => {
      const response: shareLocationResponse = JSON.parse(event.data);
      console.log(event);
      console.log("SSE data = ", response);
    })

    // eventSource.onmessage = (event) => {
    //   console.log(event)
    //   const response: shareLocationResponse = JSON.parse(event.data);
    //   console.log("SSE data: ", response);
    // };
  
    eventSource.onerror = (error) => {
      console.error("SSE 연결 에러: ", error)
      eventSource.close();
    };
  
    return () => {
      eventSource.close();
    };
  }, [sessionId]); // callId 값이 변경되면 다시 실행


  return (
    <CallerTemplate>

    </CallerTemplate>
  );
};

export default CallerPage;