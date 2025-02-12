import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DispatchButton from './DispatchButton/DispatchButton';
import { DialogDescription } from '@/components/ui/dialog';
interface BulkTransferRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hospitalNames: string[];  // hospitals: Hospital[] 대신 hospitalNames 사용
}

const BulkTransferRequestDialog = ({
  open,
  onClose,
  onConfirm,
  hospitalNames,  // props 이름 변경
}: BulkTransferRequestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>이송 요청 일괄 전송</DialogTitle>
          <DialogDescription>
            검색된 모든 병원에 이송 요청을 보냅니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <p className="font-medium mb-2">요청할 병원 목록 ({hospitalNames.length})</p>
            <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-2">
              {hospitalNames.map((name, index) => (
                <div key={index} className="py-1 px-2">
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            * 이송 요청은 모든 병원에 동시에 전송되며, 먼저 수락한 병원으로 이송됩니다.
          </p>
        </div>
        <div className="flex justify-end gap-4">
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