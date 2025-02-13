// src/features/dispatch/components/transferDetailDialog/transferDetailDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/atoms/Button/Button';
import { TransferDetailDialogProps } from './TrnsferDetailDialog.types';

const TransferDetailDialog = ({ open, onClose, data }: TransferDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">이송 상세정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 기본 정보 섹션 */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3 pb-1 border-b">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">이름</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{data.name}</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">성별</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{data.gender}</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">나이</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{data.age}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">환자 연락처</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{data.patientContact}</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">보호자 연락처</h3>
                  <div className="bg-gray-50 p-2 rounded text-sm">{data.guardianContact}</div>
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
                <div className="bg-gray-50 p-2 rounded text-sm">{data.consciousness}</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Pre-KTAS</h3>
                <div className="bg-gray-50 p-2 rounded text-sm text-red-500 font-medium">
                  {data.preKTAS}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">혈압</h3>
                <div className="bg-gray-50 p-2 rounded text-sm">
                  {data.sbp}/{data.dbp} mmHg
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">맥박</h3>
                <div className="bg-gray-50 p-2 rounded text-sm">{data.pr} bpm</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">체온</h3>
                <div className="bg-gray-50 p-2 rounded text-sm">{data.bt}°C</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">산소포화도</h3>
                <div className="bg-gray-50 p-2 rounded text-sm">{data.spo2}%</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">혈당</h3>
                <div className="bg-gray-50 p-2 rounded text-sm">{data.bst} mg/dL</div>
              </div>
            </div>
          </div>

          {/* 상세 정보 섹션 */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3 pb-1 border-b">상세 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">기저 질환</h3>
                <div className="bg-gray-50 p-2 rounded text-sm h-16 overflow-y-auto">
                  {data.medicalHistory}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">복용 약물</h3>
                <div className="bg-gray-50 p-2 rounded text-sm h-16 overflow-y-auto">
                  {data.medications}
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm text-gray-500 mb-1">신고 요약본</h3>
                <div className="bg-gray-50 p-2 rounded text-sm">{data.reportSummary}</div>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm text-gray-500 mb-1">증상 및 특이사항</h3>
                <div className="bg-gray-50 p-2 rounded text-sm whitespace-pre-wrap">
                  {data.symptoms}
                </div>
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

export default TransferDetailDialog;