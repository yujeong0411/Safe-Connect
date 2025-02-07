import { useEffect, useState } from 'react';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import { Subscriber } from 'openvidu-browser';
import CallerVideoComponent from '@features/caller/component/CallerVideoComponent.tsx';


const CallerVideoSessionUI = () => {
  const { publisher, subscribers, localUser } = useOpenViduStore();
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    const filterSubscribers = () => {
      if (!localUser) return;

      const filtered = subscribers.filter(sub =>
        sub?.stream?.connection?.connectionId !== localUser?.connectionId
      );
      setFilteredSubscribers(filtered);
    };

    filterSubscribers();
    const interval = setInterval(filterSubscribers, 2000);

    return () => {
      clearInterval(interval);
      setFilteredSubscribers([]);
    };
  }, [subscribers, localUser]);

  if (!publisher || !localUser) {
    return <div>연결 중...</div>;
  }

  return (
    <div className="w-full h-full relative">
      {filteredSubscribers.length > 0 ? (
        filteredSubscribers.map((sub) => (
          <div key={sub.stream.streamId} className="w-full h-full">
            <CallerVideoComponent streamManager={sub} />
          </div>
        ))
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p>다른 참가자를 기다리는 중...</p>
        </div>
      )}

      {publisher && (
        <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-lg">
          <CallerVideoComponent streamManager={publisher} />
        </div>
      )}
    </div>
  );
};

export default CallerVideoSessionUI;