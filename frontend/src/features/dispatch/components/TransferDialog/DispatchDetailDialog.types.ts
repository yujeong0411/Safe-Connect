import { PatientDetail } from '@/types/dispatch/dispatchRecord.types';

export interface TransferDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: PatientDetail[]; // 배열 타입으로 변경
}