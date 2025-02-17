import UserVideoComponent from './UserVideoComponent';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import { useEffect, useState } from 'react';
import { Subscriber } from 'openvidu-browser';

const VideoSessionUI = () => {
  const { publisher, subscribers, localUser } = useOpenViduStore();
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);

 

  useEffect(() => {
    console.log('VideoSessionUI - mounted');
  }, []); // 테스트용. 푸시 전 지울것

  useEffect(() => {
    // 자신의 스트림을 제외한 subscribers만 필터링
    const filterSubscribers = () => {
      const filtered = subscribers.filter(sub => {
        // localUser의 connectionId와 다른 것만 포함
        return sub.stream?.connection?.connectionId !== localUser?.connectionId;
      });
      setFilteredSubscribers(filtered);
    };

    filterSubscribers();
    // 주기적으로 체크
    const interval = setInterval(filterSubscribers, 2000);
    
    console.log('videoSessionUI - subscribers', subscribers);
    console.log('videoSessionUI - localUser', localUser);

    return () => clearInterval(interval);
  }, [subscribers, localUser]);

  return (
    <div className="w-full h-full relative">
      {/* 다른 참가자들의 비디오 (전체 화면) */}
      {filteredSubscribers.length > 0 && filteredSubscribers.map((sub) => (
        <div key={sub.stream.streamId} className="w-full h-full">
          <UserVideoComponent streamManager={sub} />
        </div>
      ))}

      {/* 자신의 화면 (오른쪽 아래 작은 화면) */}
      {publisher && (
        <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-lg">
          <UserVideoComponent streamManager={publisher} />
        </div>
      )}
    </div>
  );
};

export default VideoSessionUI;