import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/atoms/Button/Button';

interface BulkTransferRequestDialogProps {
  open: boolean;
  onClose: () => void;
  patientInfo: {
    name: string;
    gender: string;
    age: number;
    symptoms: string;
    diagnosis: string;
    preKTAS: number;
  };
  selectedHospitals: number;
}

const BulkTransferRequestDialog = ({
  open,
  onClose,
  patientInfo,
  selectedHospitals,
}: BulkTransferRequestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>이송 요청 일괄 전송</DialogTitle>
        </DialogHeader>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">환자 정보</h3>
          <div className="space-y-1">
            <p>이름: {patientInfo.name}</p>
            <p>성별: {patientInfo.gender}</p>
            <p>나이: {patientInfo.age}</p>
            <p>증상: {patientInfo.symptoms}</p>
            <p>병력: {patientInfo.diagnosis}</p>
            <p>pre-KTAS: {patientInfo.preKTAS}</p>
          </div>
        </div>
        <div className="mt-4">
          <p>총 {selectedHospitals}개의 병원에 이송 요청하시겠습니까?</p>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="gray" onClick={onClose}>
            취소
          </Button>
          <Button variant="blue">
            일괄 요청
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkTransferRequestDialog;