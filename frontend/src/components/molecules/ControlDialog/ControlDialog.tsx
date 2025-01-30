import React from 'react';
import { ButtonProps } from '@/components/atoms/Button/Button.types';
import Button from '@/components/atoms/Button/Button';

interface ControlDialogProps {
    title: string;
    content: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    buttons: {
        text: string;
        variant: ButtonProps['variant'];
        onClick: () => void;
    }[];
}

const ControlDialog: React.FC<ControlDialogProps> = ({
    title,
    content,
    isOpen,
    onClose,
    buttons
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[480px] shadow-xl">
                {/* 제목 */}
                <h2 className="text-xl font-bold mb-6">{title}</h2>

                {/* 컨텐츠 영역 */}
                <div className="mb-6">
                    {content}
                </div>

                {/* 버튼 그룹 */}
                <div className="flex gap-3">
                    {buttons.map((button, index) => (
                        <Button
                            key={index}
                            variant={button.variant}
                            onClick={button.onClick}
                            className="flex-1"
                        >
                            {button.text}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ControlDialog;