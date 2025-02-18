import { MedicalCategory } from '@/types/common/medical.types.ts';
import {Patient, User, Call} from "@/types/dispatch/dispatchOrderResponse.types.ts";

// 폼 데이터
export interface FormData {
  userName: string;
  userGender: string;
  userAge: number;
  userPhone: string;
  userProtectorPhone: string;
  diseases: string;
  medications: string;
  callSummary: string;
  addSummary: string;
  symptom: string;
  userId: number;
}

// 현재 신고 중인 정보
export interface CurrentCall {
  callId: number;
  userName?: string;
  userGender?: string;
  userAge?: number;
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
  userProtectorPhone?: string;
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

// 상황실 환자 저장 시 응답
export interface SavePatientResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: PatientInfo & {
    symptom: string;
    callSummary: string;
    patientId: number;
  };
}

// 상황실 환자 스토어
export interface PatientStore {
  isDispatched :boolean;  // 현재 출동 지령 상태 표시
  setIsDispatched(isDispatched: boolean): void;

  patientInfo: PatientInfo | null;
  currentCall: CurrentCall | null;
  formData: FormData;
  reportContent: string;
  updateReportContent: (content: string) => void;
  updateFormData: (data: Partial<FormData>) => void;
  setCurrentCall: (info: CurrentCall) => void;
  searchByPhone: (phone: string) => Promise<PatientResponse | undefined>;
  savePatientInfo: (callId: number) => Promise<void>;
  resetPatientInfo: () => void;
  sendProtectorMessage: (callerPhone: string) => Promise<boolean>;
  fetchCallSummary: (callId: number, audioBlob: Blob) => Promise<void>;
}

// 상황실 및 구급대원 보호자 알림
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
  callSummary: string;

}

// 구급대원의 환자 정보 저장 요청 타입
export interface DispatchSavePatientRequest {
  patientId: number;
  patientName?: string;
  patientGender: string;
  patientAge?: number;
  patientSymptom: string;
  patientPhone?: string;
  patientProtectorPhone?: string;
  callSummary: string;
  patientIsUser: boolean;
  // 생체정보 개별 필드로 변경
  patientBloodSugar: number | null;
  patientDiastolicBldPress: number | null;
  patientSystolicBldPress: number | null;
  patientPulseRate: number | null;
  patientTemperature: number | null;
  patientSpo2: number | null;
  patientMental: string;
  patientPreKtas: string;
}

// 구급대원 환자 정보 저장 응답 타입
export interface DispatchSavePatientResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    patientId: number;
  };
}

// 이송 수락 받은 후 받은 이송 정보 응답(병원 -> 구급대원)
// 추후 확인 후 수정 예정
export interface CurrentTransferInfo {
  transferId: number;
  hospitalName: string;
  hospitalId: number;
  acceptedAt?: string;
  completedAt?: string;
}

// 구급대원 환자 스토어
export interface DispatchPatientStore {
  // 현재 출동 내용
  currentTransfer: CurrentTransferInfo | null;
  dispatchStatus:'ongoing' | 'completed' | 'transferred';

  // 구급대원이 입력하는 모든 정보(기본정보 + 생체정보)
  formData: DispatchFormData;

  // 액션
  // 상황실에서 받은 정보로 세팅
  setPatientFromSSE: (data: {
    dispatchGroupId: number;
    dispatchId: number;
    call: Call;
    patient: Patient;
    user: User | null;
    mediInfo: MedicalCategory[] | null;
    callerLocation?: {
      lat: number;
      lng: number;
    };
  }) => void;

  // 폼데이터 업데이트
  updateFormData: (data: Partial<DispatchFormData>) => void;
  // 전체 정보 저장 (API 호출)
  savePatientInfo: () => Promise<{ patientId: number } | undefined>;
  // 초기화
  resetPatientInfo: () => void;

  preKtasAI: () => Promise<{patientPreKtas: string}>;
  sendProtectorMessage: () => Promise<ProtectorMessageResponse>;

  // 출동 관련
  completeDispatch: () => Promise<void>;  // 출동 종료

  // 이송 관련
  setTransferInfo: (info: CurrentTransferInfo) => void;
  updateTransferInfo: (info: Partial<CurrentTransferInfo>) => void;
  completeTransfer: (transferId: number) => Promise<{ isSuccess: boolean }>;  // 이송 종료
}


// 구급대원 환자정보 폼데이터
export interface DispatchFormData {
  patientId: number;
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
  patientPreKtas: string;
  patientSymptom: string;
  diseases?: string;
  medications?: string;
  patientPhone?: string;
  patientProtectorPhone?: string;
  callSummary: string;
  patientIsUser: boolean;
  dispatchId: number;
}


export interface PreKtasAIRequest {
  patientAge: number;
  patientBloodSugar: number | null;
  patientDiastolicBldPress: number | null;
  patientSystolicBldPress: number | null;
  patientPulseRate: number | null;
  patientTemperature: number | null;
  patientSpo2: number | null;
  patientMental: string;
  patientSymptom: string;
}

export interface PreKtasAIResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  patientPreKtas: string;
}
