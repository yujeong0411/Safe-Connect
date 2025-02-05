import { MedicalCategory } from '@/types/common/medical.types.ts';

// 전화번호 조회시 얻는 정보(현재 신고 중인 환자)
export interface PatientInfo {
  userName: string;
  userGender: string;
  userBirthday: string;
  userAge: number;
  userPhone: string;
  userProtectorPhone: string;
  mediInfo: MedicalCategory[];
}

// 전화 시 받는 응답
export interface CallInfo {
  callId?: number;
  callIsDispatch?: boolean;
  callSummary: string;
  callText?: string;
}

// 응답
export interface PatientResponse {
  isSuccess: string;
  code: number;
  message: string;
  data: PatientInfo | CallInfo;
}

export interface PatientStore {
  patientInfo: PatientInfo | null;
  isLoading: boolean;
  error: string | null;
  isSuccess?: boolean;
  searchByPhone: (phone: string) => Promise<PatientResponse | undefined>;
  savePatientInfo: (info: CallInfo) => Promise<void>;
  resetPatientInfo: () => void;
  sendProtectorMessage?: (callerPhone: string) => Promise<boolean>;
}

export interface ProtectorMessageRequest {
  callerPhone: string;
}

export interface ProtectorMessageResponse {
  isSuccess: boolean;
  code: number;
  message: string;
}
