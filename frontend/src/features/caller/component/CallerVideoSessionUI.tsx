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

      // 로컬 사용자의 스트림 찾기
      if (publisher?.stream?.connection?.connectionId === localUser?.connectionId) {
        setLocalStream(publisher);
      }

      // 다른 참가자들의 스트림 필터링
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
      {/* 메인 화면 (로컬 사용자) */}
      <div className="w-full h-full border-2 border-black rounded-lg">
        <CallerVideoComponent streamManager={localStream} />
      </div>

      {/* 다른 참가자들 화면 */}
      <div className="absolute right-4 gap-2 flex flex-col">
        {filteredSubscribers.map((sub, index) => {
          // 첫 번째 참가자는 아래에, 두 번째 참가자부터는 위에 쌓이도록 배치
          const topPosition = filteredSubscribers.length > 1 && index === 0 ? 'bottom-4' : 'bottom-44';

          return (
            <div
              key={sub.stream.streamId}
              className={`${topPosition} right-0 w-48 h-36 rounded-lg overflow-hidden shadow-lg`}
            >
              <CallerVideoComponent streamManager={sub} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CallerVideoSessionUI;