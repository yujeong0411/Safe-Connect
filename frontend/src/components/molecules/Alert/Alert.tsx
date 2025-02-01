import { ButtonProps } from '@/components/atoms/Button/Button.types';
import Button from '@/components/atoms/Button/Button.tsx';

interface DialogProps {
  title: string; // 제목
  message?: string; // 선택적 메시지
  isOpen: boolean; // 알림창 표시 여부
  onClose: () => void; // 닫기 함수
  buttons: {
    // 버튼 설정
    text: string;
    variant: ButtonProps['variant'];
    onClick: () => void;
  }[];
}

// components/molecules/Dialog/Dialog.tsx
import React from 'react';

const Dialog: React.FC<DialogProps> = ({ title, message, isOpen, onClose, buttons }) => {
  if (!isOpen) return null;

  return (
    // 배경 오버레이
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      {/* 알림창 */}
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        {/* 제목 */}
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* 메시지 */}
        {message && <p className="text-gray-600 mb-6">{message}</p>}

        {/* 버튼 그룹 */}
        <div className="flex gap-3">
          {buttons.map((button, index) => (
            <Button key={index} onClick={button.onClick} className={`flex-1 py-2 rounded-md`}>
              {button.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
