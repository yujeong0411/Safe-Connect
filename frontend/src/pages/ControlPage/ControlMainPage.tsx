// import { useEffect } from 'react';
import ControlMainTemplate from '@features/control/components/ControlMainTemplate.tsx';
import CallRecordForm from '@features/control/components/CallRecordForm.tsx';

const ControlMainPage = () => {

  // useEffect(() => {
  //   let eventSource: EventSource | null = null;
  //   let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  //
  //   const connectSSE = () => {
  //     const controlLoginId = localStorage.getItem("userName");
  //     if (!controlLoginId) {
  //       console.error("사용자 정보가 없습니다.");
  //       return;
  //     }
  //
  //     // 이전 연결이 있다면 정리
  //     if (eventSource) {
  //       eventSource.close();
  //     }
  //
  //     // SSE 연결
  //     eventSource = new EventSource(`http://localhost:8080/control/subscribe?clientId=${controlLoginId}`);
  //
  //     // 메시지 수신 처리
  //     eventSource.onmessage = (event) => {
  //       const response = JSON.parse(event.data);
  //       if (response.isSuccess) {
  //         console.log("신고자 위치: ", response.data);
  //         const { latitude, longitude } = response.data;
  //         console.log(`위도: ${latitude}, 경도: ${longitude}`);
  //       }
  //     };
  //
  //     // 에러 처리
  //     eventSource.onerror = (error) => {
  //       console.error("SSE 연결 에러: ", error);
  //       eventSource?.close();
  //
  //       // 재연결 시도
  //       if (reconnectTimeout) {
  //         clearTimeout(reconnectTimeout);
  //       }
  //       reconnectTimeout = setTimeout(connectSSE, 3000);
  //     };
  //   };
  //
  //   // 초기 연결
  //   connectSSE();
  //
  //   // cleanup
  //   return () => {
  //     if (eventSource) {
  //       eventSource.close();
  //     }
  //     if (reconnectTimeout) {
  //       clearTimeout(reconnectTimeout);
  //     }
  //   };
  // }, []);

  //   const controlLoginId = localStorage.getItem("userName");
  //   if (!controlLoginId) {
  //     console.error("사용자 정보가 없습니다.");
  //     return;
  //   }

  //   // SSE 연결
  //   const eventSource = new EventSource(`http://localhost:8080/control/subscribe?clientId=${controlLoginId}`);

  //   // 메시지 수신 처리
  //   eventSource.onmessage = (event) => {
  //     const response = JSON.parse(event.data);
  //     if (response.isSuccess) {
  //       console.log("신고자 위치: ", response.data);
  //       const { latitude, longitude } = response.data;
  //       console.log(`위도: ${latitude}, 경도: ${longitude}`);
  //     }
  //   };

  //   // 에러 처리
  //   eventSource.onerror = (error) => {
  //     console.error("SSE 연결 에러: ", error);
  //     eventSource.close();
  //   }

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);


  return (
    <ControlMainTemplate>
      <CallRecordForm />
    </ControlMainTemplate>
  );
};

export default ControlMainPage;
