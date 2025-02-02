// src/components/organisms/GuardianNotifyDialog/GuardianNotifyDialog.tsx
import React from 'react';
import Dialog from '@/components/molecules/Alert/Alert';

interface GuardianNotifyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuardianNotifyDialog: React.FC<GuardianNotifyDialogProps> = ({ isOpen, onClose }) => {
  const message = `[Safe Connect] 응급 신고 접수 알림

[000]님의 119 신고가 접수되었습니다.
• 신고 시각: 2024.01.17 14:30
• 신고 위치: 광주광역시 광산구 장덕동 1442
• 현재 상태: 구급대원 출동 중

*환자의 위치로 이동 중이신 경우, 안전운전 바랍니다.

보호자 연락처: 010-0000-0000`;

  const handleSend = () => {
    // 알림 전송 로직
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="보호자 알림 전송"
      message={message}
      onClose={onClose}
      buttons={[
        {
          text: '전송',
          variant: 'blue',
          onClick: handleSend,
        },
      ]}
    />
  );
};

export default GuardianNotifyDialog;
