// src/components/organisms/VideoCallDialog/VideoCallDialog.tsx
import React from 'react';
import Dialog from '@/components/molecules/Alert/Alert';

interface VideoCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallDialog: React.FC<VideoCallDialogProps> = ({ isOpen, onClose }) => {
  const handleCreateAndSend = () => {
    // 영상통화방 생성 및 URL 전송 로직
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="영상통화 생성"
      message={`신고자 전화번호 : 010-0000-0000`}
      onClose={onClose}
      buttons={[
        {
          text: '영상통화방 생성 및 url전송',
          variant: 'blue',
          onClick: handleCreateAndSend,
        },
        {
          text: '닫기',
          variant: 'gray',
          onClick: onClose,
        },
      ]}
    />
  );
};

export default VideoCallDialog;
