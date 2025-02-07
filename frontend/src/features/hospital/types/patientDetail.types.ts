export interface PatientDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buttons: string;
  data?: {
    name?: string;
    gender: string;
    age?: string;
    mental: string;
    preKTAS: string;
    sbp: number;
    dbp: number;
    pr: number;
    bt: number;
    spo2: number;
    bst?: number;
    phone: string;
    protectorPhone?: string;
    symptoms: string;
    diseases?: string;
    medications?: string;
    requestTransferAt: string;
  }
}
