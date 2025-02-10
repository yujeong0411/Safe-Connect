// hooks/useHospitalSSE.ts
import { useState, useEffect } from 'react';
import { NotificationMessage } from '@/features/dispatch/types/notification.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const useHospitalSSE = (isRequesting: boolean) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  useEffect(() => {
    if (!isRequesting) return;

    const eventSource = new EventSource(`${API_URL}/api/hospital-requests/status`);

    eventSource.onmessage = (event) => {
      const data: NotificationMessage = JSON.parse(event.data);
      setNotifications(prev => [...prev, data]);
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isRequesting]);

  return notifications;
};