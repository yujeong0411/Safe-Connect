// 공통 응답 형식
export interface BaseResponse {
    isSuccess: boolean;
    code: number;
    message: string;
}

// 전체 이송 목록 응답
export interface TransferResponse extends BaseResponse {
    data: TransferData[]
}

// 수락된 이송 목록 응답
export interface AcceptedTransferResponse extends BaseResponse {
    data: AcceptedTransfer[]
}

// 이송 신청 내역 조회
export interface TransferData {
    dispatchId: number
    fireDeptName: string // 관할 소방서
    reqHospitalCreatedAt: string  // 요청 시간
    dispatchIsTransfer: boolean // 이송 여부
    patients: patients[]
    dispatchTransferAccepted: boolean | null
}

// 전체 이송 조회 시 환자 정보
export interface patients {
    patientId: number
    patientPreKtas: string
    patientGender: string
    patientAge: string
    patientSymptom: string
    patientPhone: string // 환자 연락처 추가
}

export interface TransferStore {
    combinedTransfers: CombinedTransfer[];
    fetchCombinedTransfers: () => Promise<TransferData[]>;
    fetchTransferDetail: (dispatchId: number, type: 'request' | 'accept') => Promise<PatientDetail>;
    updateTransferStatus: (dispatchId: number, status: 'ACCEPTED' | 'REJECTED') => Promise<any>;
}

// 이송 신청 상세 조회
export interface PatientDetail {
    patientId: number
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
    userPhone: string;
    userProtectorPhone?: string;
    patientSymptom: string;
    patientMedications: string[];
    patientDiseases: string[];
}

// 이송 수락 내역 조회
export interface AcceptedTransfer {
    transferAcceptAt: string;
    transferArriveAt: string;
    dispatchId: number;
    hospital: Hospital;
}

// 병원 정보
export interface Hospital {
    hospitalName: string;
    locationPoint: string;
}

// 전체 이송신청 목록 + 수락 목록
export interface CombinedTransfer extends TransferData {
    transferAcceptAt: string | null;
    transferArriveAt: string | null;
    hospital: Hospital | null;
}

export interface TransferRequestEventData extends BaseResponse {
    data: {
        dispatchId: number;
        patient: TransferPatientData;
    };
}

export interface TransferPatientData {
    patientId: number;
    patientAge: string;
    patientGender: string;
    patientPreKtas: string;
    patientSymptoms: string;
    patientPhone: string; // 환자 연락처 추가
    reqHospitalCreatedAt: string;
}