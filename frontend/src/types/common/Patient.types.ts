import { MedicalCategory } from '@/types/common/medical.types.ts';
// 폼 데이터
export interface FormData {
  userName: string;
  userGender: string;
  userAge: string;
  userPhone: string;
  userProtectorPhone: string;
  diseases: string;
  medications: string;
  callSummary: string;
  addSummary:string;
  symptom: string;
  userId: number;
}


// 현재 신고 중인 정보
export interface CurrentCall {
  userName?: string;
  userGender?: string;
  userAge?: string;
  userPhone?: string;
  userProtectorPhone?: string;
  diseases?: string;
  medications?: string;
  callSummary: string;
  symptom?: string;
  userId: number | null;
  patientId: number | null;
}

// 전화번호 조회시 얻는 정보(현재 신고 중인 환자)
export interface PatientInfo {
  userId: number;
  userName: string;
  userGender: string;
  userBirthday: string;
  userAge: number;
  userPhone: string;
  userProtectorPhone: string;
  mediInfo: MedicalCategory[];
}

// 신고 수정시 request
export interface CallInfoRequset {
  callId: number;
  userId: number | null;
  symptom?: string;
  callSummary: string;
}

// 응답
export interface PatientResponse {
  isSuccess: string;
  code: number;
  message: string;
  data: PatientInfo | CallInfoRequset;
}

export interface SavePatientResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: PatientInfo & {
    symptom: string;
    callSummary: string;
    patientId: number;
  }
}

export interface PatientStore {
  patientInfo: PatientInfo | null;
  currentCall: CurrentCall | null;
  formData: FormData;
  reportContent:string;
  updateReportContent:(content: string) => void;
  updateFormData: (data:Partial<FormData>) => void;
  setCurrentCall: (info: CurrentCall) => void;
  searchByPhone: (phone: string) => Promise<PatientResponse | undefined>;
  savePatientInfo: (callId: number) => Promise<void>;
  resetPatientInfo: () => void;
  sendProtectorMessage: (callerPhone: string) => Promise<boolean>;
  fetchCallSummary : (callId:number, audioBlob: Blob) => Promise<void>
}

export interface ProtectorMessageResponse {
  isSuccess: boolean;
  code: number;
  message: string;
}


// 신고 요약 응답
export interface CallSummaryResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    callSummary: string;
  }
}

export interface VitalSigns {
  patientBloodSugar: number;
  patientDiastolicBldPress: number;
  patientSystolicBldPress: number;
  patientBreatheRate: number;
  patientTemperature: number;
  patientSpo2: number;
  patientMental: string;
  patientPreKtas: number;
}

export interface DispatchPatientInfo extends PatientInfo {
  vistalSign : VitalSigns
}

