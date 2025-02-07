import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/atoms/Button/Button';
import Input from '@/components/atoms/Input/Input';

interface GuardianNotificationDialogProps {
  open: boolean;
  onClose: () => void;
  patientInfo: {
    name: string;
    hospitalName: string;
  };
  guardianContact: string;
}

const GuardianNotificationDialog = ({
  open,
  onClose,
  patientInfo,
  guardianContact,
}: GuardianNotificationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>보호자 알림 전송</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-center">
              환자 [{patientInfo.name}]님이 [{patientInfo.hospitalName}]으로 이송 완료 되었습니다.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              *보호자께서는 상기 병원으로 내원해 주시기 바랍니다.
              *응급실 도착 시 119 구급대원 이송환자임을 말씀해 주세요.
            </p>
          </div>
          <Input
            label="보호자 연락처"
            value={guardianContact}
            disabled
          />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="gray" onClick={onClose}>
            취소
          </Button>
          <Button variant="blue">
            전송
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuardianNotificationDialog;