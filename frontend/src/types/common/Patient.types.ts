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
  callId: number;
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

// 상황실 신고 수정시 request
export interface CallInfoRequest {
  callId: number;
  userId: number | null;
  symptom?: string;
  callSummary: string;
}

// 상황실 응답
export interface PatientResponse {
  isSuccess: string;
  code: number;
  message: string;
  data: PatientInfo | CallInfoRequest;
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
  patientPulseRate: number;
  patientTemperature: number;
  patientSpo2: number;
  patientMental: string;
  patientPreKtas: string;
}

export interface DispatchPatientInfo extends PatientInfo {
  vistalSign : VitalSigns
}

// 구급대원의 환자 정보 저장 요청 타입
export interface DispatchSavePatientRequest {
  patientId: number;
  patientIsUser: boolean;
  patientName: string;
  patientGender: 'M' | 'F';
  patientAge: string;
  patientSymptom: string;
  vitalSigns: VitalSigns;
}

// 구급대원 환자 정보 저장 응답 타입
export interface DispatchSavePatientResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    patientId: number;
  }
}

// 구급대원 환자 스토어
export interface DispatchPatientStore{
  // 기본 정보 (상황실에서 받은 정보)  -> 상황에 따라 좀 더 유연하게 설정
  baseInfo: Partial<CurrentCall> | null;
  // baseInfo: {
  //   patientId: number | null;
  //   patientName: string;
  //   patientGender: string;
  //   patientAge: string;
  //   diseases: string;
  //   medications: string;
  //   symptom: string;
  //   callSummary: string;
  // } | null;

  addInfo: {
    patientName: string;
    patientGender: string;
    patientAge: string;
    symptom: string;
  }
  // 생체 징후
  vitalSigns: VitalSigns;

  // 액션
  // 상황실에서 받은 정보로 초기화
  initialBaseInfo: (info: CurrentCall) => void;
  // 생체정보 업데이트
  updateVitalSigns: (signs: Partial<VitalSigns>) => void;
  // 전체 정보 저장 (API 호출)
  savePatientInfo: () => Promise<void>;
  // 초기화
  resetPatientInfo: () => void;
}

// 구급대원 환자정보 폼데이터

