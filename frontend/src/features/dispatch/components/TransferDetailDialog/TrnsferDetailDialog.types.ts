// src/features/dispatch/components/transferDetailDialog/transferDetailDialog.types.ts

export interface TransferDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: TransferDetailData;
}

export interface TransferDetailData {
  // 기본 정보
  name: string;
  gender: string;
  age: string;
  patientContact: string;
  guardianContact: string;
  
  // 생체 징후
  consciousness: string;
  preKTAS: string;
  sbp: string;
  dbp: string;
  pr: string;
  bt: string;
  spo2: string;
  bst: string;
  
  // 상세 정보
  medicalHistory: string;
  medications: string;
  reportSummary: string;
  symptoms: string;
}