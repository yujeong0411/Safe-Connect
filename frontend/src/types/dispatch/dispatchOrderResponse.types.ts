// types/dispatch.types.ts
export interface MediDto {
  mediId: number;
  mediName: string;
}

export interface MediCategoryDto {
  categoryId: number;
  categoryName: string;
  mediList: MediDto[];
}

export interface Patient {
  patientId: number;
  patientIsUser: boolean;
  patientName: string;
  patientGender: string;
  patientAge: number;
  patientBloodSugar: number | null;
  patientDiastolicBldPress: number | null;
  patientSystolicBldPress: number | null;
  patientPulseRate: number | null;
  patientTemperature: number | null;
  patientSpo2: number | null;
  patientMental: string | null;
  patientPreKtas: number | null;
  patientSympthom: string | null;
}

export interface DispatchOrderResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    dispatchId: number;
    callId: number;
    patient: Patient;
    mediInfo?: MediCategoryDto[];
  }
}