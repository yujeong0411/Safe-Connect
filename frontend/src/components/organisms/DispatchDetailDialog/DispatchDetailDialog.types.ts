// src/components/organisms/DispatchDetailDialog/DispatchDetailDialog.types.ts
export interface PatientInfo {
  name: string;
  gender: string;
  age: number;
  consciousness: string;
  preKTAS: number;
  patientPhone: string;
}

export interface VitalSigns {
  sbp: number;
  dbp: number;
  rr: number;
  bt: number;
  spo2: number;
  bst: number;
  guardianPhone: string;
}

export interface TransferInfo {
  symptoms: string;
  location: string;
  diagnosis: string;
  medication: string;
  notes: string;
  hospital: string;
  requestTime: string;
  completeTime: string;
  transferDate: string;
}

export interface DispatchDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientInfo: PatientInfo;
  vitalSigns: VitalSigns;
  transferInfo: TransferInfo;
}