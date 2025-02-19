import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/atoms/Button/Button';
import { TransferDetailDialogProps } from './DispatchDetailDialog.types.ts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { MediCategory,MediInfo } from '@/types/dispatch/dispatchRecord.types';

const DispatchDetailDialog = ({ open, onClose, data }: TransferDetailDialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">이송 상세정보</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-8">
            <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="blue" onClick={onClose}>닫기</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentPatient = data[currentIndex];
  const hasMultiplePatients = data.length > 1;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">이송 상세정보</DialogTitle>
            {hasMultiplePatients && (
              <div className="text-sm text-gray-500">
                {currentIndex + 1} / {data.length}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="relative">
          {hasMultiplePatients && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === data.length - 1}
                className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="space-y-4">
            {/* 기본 정보 섹션 */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3 pb-1 border-b">기본 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">이름</h3>
                    <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.patientName}</div>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">성별</h3>
                    <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.patientGender}</div>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">나이</h3>
                    <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.patientAge}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">환자 연락처</h3>
                    <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.user?.userPhone || '-'}</div>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">보호자 연락처</h3>
                    <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.user?.protectorPhone || '-'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 생체 징후 섹션 */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3 pb-1 border-b">생체 징후</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">의식상태</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.patientMental}</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Pre-KTAS</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm text-red-500 font-medium">
                    {currentPatient.patientPreKtas}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">혈압</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    {currentPatient.patientSystolicBldPress}/{currentPatient.patientDiastolicBldPress} mmHg
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">맥박</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.patientPulseRate} bpm</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">체온</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.patientTemperature}°C</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">산소포화도</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.patientSpo2}%</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">혈당</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{currentPatient.patientBloodSugar} mg/dL</div>
                </div>
              </div>
            </div>

            {/* 약물 정보 섹션 */}
            {currentPatient.mediInfo && currentPatient.mediInfo.length > 0 && (
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3 pb-1 border-b">약물 정보</h3>
                <div className="space-y-4">
                  {currentPatient.mediInfo.map((category:MediCategory) => (
                    <div key={category.categoryId}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{category.categoryName}</h4>
                      <div className="bg-gray-50 p-2 rounded text-sm">
                        {category.mediList.map((medi : MediInfo) => medi.mediName).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 증상 섹션 */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3 pb-1 border-b">증상 및 특이사항</h3>
              <div className="bg-gray-50 p-2 rounded text-sm whitespace-pre-wrap">
                {currentPatient.patientSymptom}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="blue" onClick={onClose}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchDetailDialog;