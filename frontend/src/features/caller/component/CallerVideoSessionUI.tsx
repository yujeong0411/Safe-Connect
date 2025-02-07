import { useEffect, useState } from 'react';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import { Publisher, Subscriber } from 'openvidu-browser';
import CallerVideoComponent from '@features/caller/component/CallerVideoComponent.tsx';

const CallerVideoSessionUI = () => {
  const { publisher, subscribers, localUser } = useOpenViduStore();
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [localStream, setLocalStream] = useState<Publisher | null>(null);

  useEffect(() => {
    const filterAndSetStreams = () => {
      if (!localUser) return;

      if (publisher?.stream?.connection?.connectionId === localUser?.connectionId) {
        setLocalStream(publisher);
      }

      const filtered = subscribers.filter(sub =>
        sub?.stream?.connection?.connectionId !== localUser?.connectionId
      );
      setFilteredSubscribers(filtered);
    };

    filterAndSetStreams();
    const interval = setInterval(filterAndSetStreams, 2000);

    return () => {
      clearInterval(interval);
      setFilteredSubscribers([]);
      setLocalStream(null);
    };
  }, [subscribers, localUser, publisher]);

  if (!localStream || !localUser) {
    return <div>연결 중...</div>;
  }

  return (
    <div className="p-1 w-full h-full relative">
      {/* 메인 비디오 컨테이너 */}
      <div className="w-full h-full">
        <CallerVideoComponent streamManager={localStream} />
      </div>

      {/* 작은 비디오들 */}
      {filteredSubscribers.map((sub, index) => {
        const isFirstSubscriber = index === 0;
        const position = filteredSubscribers.length > 1 && isFirstSubscriber
          ? 'bottom-4'  // 첫 번째 구독자는 아래에
          : 'top-4';    // 두 번째 구독자는 위에

        return (
          <div
            key={sub.stream.streamId}
            className={`absolute right-4 ${position} w-24 h-18 rounded-lg overflow-hidden shadow-lg z-10`}
          >
            <CallerVideoComponent streamManager={sub} />
          </div>
        );
      })}
    </div>
  );
};

export default CallerVideoSessionUI;