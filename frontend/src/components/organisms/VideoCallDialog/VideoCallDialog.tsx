// src/components/organisms/VideoCallDialog/VideoCallDialog.tsx
import React, { useState } from 'react';
import ControlDialog from '@/components/molecules/ControlDialog/ControlDialog';
import Input from '@/components/atoms/Input/Input';

interface VideoCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallDialog = ({ isOpen, onClose }: VideoCallDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCreateRoom = () => {
    // 영상통화방 생성 로직
    console.log('Creating video call room with:', phoneNumber);
    onClose();
  };

  return (
    <ControlDialog
      isOpen={isOpen}
      onClose={onClose}
      title="영상통화 생성"
      content={
        <div>
          <Input
            label="신고자 전화번호"
            placeholder="010-0000-0000"
            width="full"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      }
      buttons={[
        {
          text: "영상통화방 생성 및 url 전송",
          variant: "blue",
          onClick: handleCreateRoom
        },
        {
          text: "닫기",
          variant: "gray",
          onClick: onClose
        }
      ]}
    />
  );
};

export default VideoCallDialog;