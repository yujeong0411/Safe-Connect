// src/features/dispatch/components/TransferDetailDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DispatchData } from '@/features/dispatch/types/types';
import  Button from '@/components/atoms/Button/Button';

interface TransferDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: DispatchData;
}

const TransferDetailDialog = ({ open, onClose, data }: TransferDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">이송 상세정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">이름</h3>
                <div className="bg-white p-2 rounded">{data.patientName}</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">성별</h3>
                <div className="bg-white p-2 rounded">{data.gender}</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">나이</h3>
                <div className="bg-white p-2 rounded">{data.age}</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">의식상태</h3>
                <div className="bg-white p-2 rounded">{data.consciousness}</div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">pre-KTAS</h3>
                <div className="bg-white p-2 rounded text-red-500">{data.preKTAS}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">SBP</h3>
                  <div className="bg-white p-2 rounded">{data.vitals?.sbp}</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">DBP</h3>
                  <div className="bg-white p-2 rounded">{data.vitals?.dbp}</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">RR</h3>
                  <div className="bg-white p-2 rounded">{data.vitals?.rr}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">BT</h3>
                  <div className="bg-white p-2 rounded">{data.vitals?.bt}</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">SPO2</h3>
                  <div className="bg-white p-2 rounded">{data.vitals?.spo2}</div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">BST</h3>
                  <div className="bg-white p-2 rounded">{data.vitals?.bst}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">증상</h3>
              <div className="bg-white p-2 rounded min-h-[60px]">{data.symptoms}</div>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">현재 병력</h3>
              <div className="bg-white p-2 rounded min-h-[60px]">{data.diagnosis}</div>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">복용 약물</h3>
              <div className="bg-white p-2 rounded min-h-[60px]">{data.medications}</div>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">노바스크 정</h3>
              <div className="bg-white p-2 rounded min-h-[60px]">{data.notes}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">이송 요청 일시</h3>
              <div className="bg-white p-2 rounded">{data.transferInfo?.requestTime}</div>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">이송 종료 일시</h3>
              <div className="bg-white p-2 rounded">{data.transferInfo?.endTime}</div>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">이송 병원</h3>
              <div className="bg-white p-2 rounded">{data.transferInfo?.hospital}</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="blue" onClick={onClose}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDetailDialog;