import React, { useCallback } from 'react';
import OvVideo from './OvVideo';
import { StreamManager } from 'openvidu-browser';

interface UserVideoProps {
  streamManager: StreamManager;
  className?: string;
}

interface ConnectionData {
  clientData: {
    user: {
      nickname: string;
      role: string;
    };
  };
}

const UserVideo: React.FC<UserVideoProps> = ({ streamManager, className }) => {
  const getConnectionData = useCallback((): ConnectionData => {
    const { connection } = streamManager.stream;
    return JSON.parse(connection.data);
  }, [streamManager]);

  const getRoleKor = useCallback((role: string): string => {
    return role === "runner" ? "노비" : "추노꾼";
  }, []);

  if (!streamManager) {
    return null;
  }

  const { clientData } = getConnectionData();
  const roleKor = getRoleKor(clientData.user.role);

  return (
    <div>
      <div className={`camera_name ${clientData.user.role}`}>
        {clientData.user.nickname} {roleKor}
      </div>
      <OvVideo
        streamManager={streamManager}
        className={className}
      />
    </div>
  );
};

// CSS를 JavaScript 객체로 변환해서 style 태그로 적용
const styles = `
  .camera_name {
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2px;
    border-radius: 7px;
    position: absolute;
  }
  
  .runner {
    color: #ffb1b1;
  }
  
  .chaser {
    color: #b1c2ff;
  }
`;

// style 태그를 동적으로 추가
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default UserVideo;