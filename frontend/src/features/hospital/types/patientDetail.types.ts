export interface PatientDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buttons: string;
  data: {
    name: string | null;
    gender: string;
    age: string | null;
    mental: string;
    preKTAS: string;
    sbp: number;
    dbp: number;
    pr: number;
    bt: number;
    spo2: number;
    bst: number | null;
    phone: string;
    protectorPhone: string | null;
    symptoms: string;
    diseases: string | null;
    medications: string | null;
    requestTransferAt: string;
    transferAcceptedAt?: string;
    transferArriveAt?: string;
  }
}
