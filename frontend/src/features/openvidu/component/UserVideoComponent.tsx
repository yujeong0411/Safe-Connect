import { useEffect, useRef } from 'react';
import { StreamManager } from 'openvidu-browser';

interface Props {
    streamManager: StreamManager;
}

const UserVideoComponent = ({ streamManager }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (
      <video
        autoPlay
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
      />
    );
};

export default UserVideoComponent;