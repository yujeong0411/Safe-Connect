import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DispatchButton from './DispatchButton/DispatchButton';
import { DialogDescription } from '@/components/ui/dialog';
interface BulkTransferRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hospitalNames: string[]; 
}

const BulkTransferRequestDialog = ({
  open,
  onClose,
  onConfirm,
  hospitalNames,  // props 이름 변경
}: BulkTransferRequestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90%] sm:w-[80%] md:w-[60%] lg:max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle  className="text-lg sm:text-xl md:text-2xl text-center sm:text-left">이송 요청 일괄 전송</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            검색된 모든 병원에 이송 요청을 보냅니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <p className="font-medium mb-2 text-sm sm:text-base">요청할 병원 목록 ({hospitalNames.length})</p>
            <div className="max-h-32 sm:max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-2 sm:p-3">
              {hospitalNames.map((name, index) => (
                <div key={index} className="py-1 px-2 text-sm sm:text-base border-b border-gray-100 last:border-b-0">
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            * 이송 요청은 모든 병원에 동시에 전송되며, 먼저 수락한 병원으로 이송됩니다.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">
          <DispatchButton variant="gray" onClick={onClose}>
            취소
          </DispatchButton>
          <DispatchButton variant="blue" onClick={onConfirm}>
            전송
          </DispatchButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkTransferRequestDialog;