// src/components/organisms/EmergencyDetailModal/EmergencyDetailModal.tsx
import React from 'react';
import { ControlDialog, ControlDialogContent } from '@/components/atoms/ControlDialog/ControlDialog';
import Button from '@/components/atoms/Button/Button';

interface EmergencyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    name: string;
    gender: string;
    age: number;
    reportTime: string;
    processTime: string;
    dispatchTime: string;
    symptoms: string;
    currentCondition: string;
    medications: string;
    patientPhone: string;
    guardianPhone: string;
    notes: string;
  };
}

const EmergencyDetailModal = ({ isOpen, onClose, data }: EmergencyDetailModalProps) => {
  // 정보 필드를 표시하는 재사용 가능한 컴포넌트
  const InfoField = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <div className="mt-1 p-2 bg-gray-50 rounded-md min-h-[2.5rem]">
        {value || '-'}
      </div>
    </div>
  );

  return (
    <ControlDialog open={isOpen} onOpenChange={onClose}>
      <ControlDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">신고 상세정보</h2>

        <div className="grid grid-cols-4 gap-4">
          <InfoField label="이름" value={data?.name} />
          <InfoField label="성별" value={data?.gender} />
          <InfoField label="나이" value={data?.age} />
          <InfoField label="신고 일시" value={data?.reportTime} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <InfoField label="신고 종료 일시" value={data?.processTime} />
          <InfoField label="출동 일시" value={data?.dispatchTime} />
        </div>

        <div className="mt-4">
          <InfoField label="증상" value={data?.symptoms} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <InfoField label="현재 병력" value={data?.currentCondition} />
          <InfoField label="복용 약물" value={data?.medications} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <InfoField label="신고자 연락처" value={data?.patientPhone} />
          <InfoField label="보호자 연락처" value={data?.guardianPhone} />
        </div>

        <div className="mt-4">
          <InfoField label="요약본" value={data?.notes} />
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            variant="secondary"
            onClick={onClose}
            className="px-6 py-2 bg-[#545F71] text-white hover:bg-[#434b59]"
          >
            닫기
          </Button>
        </div>
      </ControlDialogContent>
    </ControlDialog>
  );
};

export default EmergencyDetailModal;