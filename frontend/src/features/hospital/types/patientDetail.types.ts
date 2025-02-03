export interface PatientDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buttons: string;
  data?: {
    name: string;
    gender: string;
    age: number;
    mental: string;
    preKTAS: number;
    contact: string;
    // 생체 징후
    sbp: number;
    dbp: number;
    pr: number;
    bt: number;
    spo2: number;
    bst: number;
    phone: string;
    protectorPhone: string;
    symptoms: string;
    diseases: string;
    medications: string;
    transferCall?: string;
    transferArrive?: string;
    controlCall?: string;
  };
}
