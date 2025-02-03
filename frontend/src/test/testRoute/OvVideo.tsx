import React, { useEffect, useRef } from 'react';
import { StreamManager } from 'openvidu-browser';

interface OvVideoProps {
  streamManager: StreamManager;
  className?: string;
}

const OvVideo: React.FC<OvVideoProps> = ({ streamManager, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <video
      autoPlay={true}
      ref={videoRef}
      className={className}
    />
  );
};

export default OvVideo;