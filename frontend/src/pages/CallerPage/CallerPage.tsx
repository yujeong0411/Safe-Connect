
import CallerTemplate from '@features/caller/component/CallerTemplate.tsx';
import { useEffect } from 'react';

const CallerPage = () => {  

  useEffect(() => {
    
    let subscribeUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    if (subscribeUrl !== "http://localhost:8080") {
      subscribeUrl += "/api"
    }

    // SSE 연결결
    // const eventSource = new EventSource(`${subscribeUrl}/caller/subscribe/${callId}`); 


  })





  return (
    <CallerTemplate>

    </CallerTemplate>
  );
};

export default CallerPage;