export interface EmergencyDetailData {
  name: string;
  gender: string;
  age: number;
  reportTime: string;
  processTime: string;
  dispatchTime: string;
  symptoms: string;
  currentDiseases: string;
  medications: string;
  patientPhone: string;
  protectorPhone: string;
}

export interface EmergencyDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: EmergencyDetailData;
}
