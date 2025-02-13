// src/features/dispatch/components/VideoCall/VideoCallDrawer.tsx
import { useRef, useState, useEffect } from 'react';
import DispatchButton from '../DispatchButton/DispatchButton';

interface VideoCallDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallDrawer = ({ isOpen, onClose }: VideoCallDrawerProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // 연결 종료 시 정리
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      return;
    }

    const startCall = async () => {
      try {
        // 미디어 스트림 가져오기
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // 로컬 비디오에 스트림 연결
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // WebRTC 연결 설정
        const configuration = {
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        };

        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;

        // 스트림 트랙 추가
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        // 원격 스트림 처리
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // ICE candidate 처리
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            // 시그널링 서버로 candidate 전송
            // sendIceCandidate(event.candidate);
          }
        };
      } catch (error) {
        console.error('Failed to start video call:', error);
      }
    };

    startCall();

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localVideoRef.current?.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream).getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream).getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!isCameraOff);
    }
  };

  return (
    <div
      className={`
      fixed top-[150px] left-0 w-1/2 h-[calc(100vh-100px)] 
      bg-bg z-40 transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">영상통화</h2>
            <DispatchButton variant="gray" size="sm" width="auto" onClick={onClose}>
              접기
            </DispatchButton>
          </div>
          <p className="text-sm text-gray-500 mt-1">환자와의 영상통화가 연결됩니다.</p>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1 bg-gray-900 rounded-lg relative mb-4">
            <video ref={remoteVideoRef} className="w-full h-full rounded-lg" autoPlay playsInline />
            <video
              ref={localVideoRef}
              className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg"
              autoPlay
              playsInline
              muted
            />
          </div>

          <div className="flex justify-center gap-4">
            <DispatchButton variant="blue" width="auto" onClick={toggleMute}>
              {isMuted ? '마이크 ON' : '마이크 OFF'}
            </DispatchButton>
            <DispatchButton variant="blue" width="auto" onClick={toggleCamera}>
              {isCameraOff ? '카메라 ON' : '카메라 OFF'}
            </DispatchButton>
            <DispatchButton variant="red" width="auto" onClick={onClose}>
              통화 종료
            </DispatchButton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoCallDrawer;
