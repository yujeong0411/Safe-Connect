import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/atoms/Button/Button';

interface BulkTransferRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hospitalName: string;
}

const BulkTransferRequestDialog = ({
  open,
  onClose,
  onConfirm,
  hospitalName,
}: BulkTransferRequestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">이송 요청 일괄 전송</DialogTitle>
        </DialogHeader>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-center mb-4">{hospitalName}에</p>
          <p className="text-center">이송 요청하시겠습니까?</p>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="gray" onClick={onClose}>취소</Button>
          <Button variant="blue" onClick={onConfirm}>일괄 요청</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkTransferRequestDialog;