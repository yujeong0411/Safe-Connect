// import {CallInfoRequest} from "@/types/common/Patient.types.ts";
// import {PatientInfo} from "@/types/common/Patient.types.ts";
// import {PatientDetail} from "@/types/hospital/hospitalTransfer.types.ts";
import {MedicalCategory} from "@/types/common/medical.types.ts";

// 회원인 경우 필요
export interface User {
  userPhone: string;
  protectorPhone: string;
}

// 신고 정보
export interface Call {
  callId: number;
  callSummary: string;
  callerPhone: string;
}

// patient 타입 정리 (sse.types에 있던 것 삭제)
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
  patientMental: string;
  patientPreKtas: number;
  patientSymptom: string;
}


export interface DispatchOrderResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    dispatchGroupId: number;
    call: Call;
    patient: Patient;
    user: User | null;
    mediInfo: MedicalCategory[] | null;
    sessionId: string;
  }
}