// 상황실 신고 내역 조회
export interface Caller {
  callerPhone: string;
}


export interface DispatchRecord {
  dispatchId: number;
  callerPhone: string;
  dispatchIsTransfer: boolean;
  dispatchCreatedAt: string;
  dispatchDepartAt: string;
  dispatchArriveAt: string;
  transfer?: {
    hospital: {
      hospitalName: string;
    };
    transferAcceptAt: string;
    transferArriveAt: string;
  };
}

export interface HospitalInfo {
  hospitalName: string;
  locationPoint: string;
}
export interface DispatchInfo {
  dispatchIsTransfer: boolean;
  dispatchCreatedAt: string;
  dispatchDepartAt: string | null;
  dispatchArriveAt: string | null;
}

export interface DispatchResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: DispatchRecord[] | DispatchRecord;
}

export interface PatientDetailResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: PatientDetail[] | null;
}
export interface PatientDetail {
  patientId: number;
  patientName: string;
  patientGender: string;
  patientAge: string;
  patientMental: string;
  patientSystolicBldPress: number;
  patientDiastolicBldPress: number;
  patientPulseRate: number;
  patientTemperature: number;
  patientSpo2: number;
  patientBloodSugar: number;
  patientPreKtas: string;
  user: UserInfo | null;
  patientSymptom: string;
  mediInfo: MediCategory[];
}

interface UserInfo {
  userPhone: string;
  protectorPhone: string | null;
}

export interface MediCategory {
  categoryId: number;
  categoryName: string;
  mediList: MediInfo[];
}

export interface MediInfo {
  mediId: number;
  mediName: string;
}

export interface DispatchListStore {
  dispatchList: DispatchRecord[];
  dispatchDetail: PatientDetail[] | null;
  fetchDispatchList: () => Promise<void>;
  fetchDispatchDetail: (dispatchId: number) => Promise<void>;
}
