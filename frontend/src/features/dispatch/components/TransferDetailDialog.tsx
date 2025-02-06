// src/features/dispatch/components/TransferDetailDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/atoms/Button/Button';
import { DispatchData } from '../types/types';

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
            
            {/* 나머지 코드는 동일 */}
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