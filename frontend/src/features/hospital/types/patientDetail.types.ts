export interface PatientDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buttons?: string;
  data: {
    dispatchId : number
    patientId: number
    name?: string | null;
    gender?: string | null;
    age?: string | null;
    mental: string;
    preKTAS: string;
    sbp: number;
    dbp: number;
    pr: number;
    bt: number;
    spo2: number;
    bst: number;
    phone: string;
    protectorPhone?: string | null;
    symptoms: string;
    diseases?: string;
    medications?: string;
    requestTransferAt: string;
    transferAcceptAt?: string;
    transferArriveAt?: string;
  }
}
