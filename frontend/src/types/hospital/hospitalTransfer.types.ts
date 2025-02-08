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
    fireDeptName:string // 관할 소방서
    reqHospitalCreatedAt: string  // 요청 시간
    dispatchIsTransfer: boolean // 이송 여부
    patients: patients[]
    dispatchTransferAccepted: boolean | null
}

// 전체 이송 조회 시 환자 정보
export interface patients {
    patientId: number  // 벡엔드 아직 추가 안됨.
    patientPreKtas:string
    patientGender:string
    patientAge:string
    patientSymptom:string
}

export interface TransferStore {
    combinedTransfers: CombinedTransfer[];
    fetchCombinedTransfers: () => Promise<TransferData[]>;
    fetchTransferDetail: (dispatchId: number, type: 'request' | 'accept') => Promise<PatientDetail>;
    updateTransferStatus: (dispatchId: number, status: 'ACCEPTED' | 'REJECTED') => Promise<any>;
}

// 이송 신청 상세 조회
export interface PatientDetail {
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
    userPhone: string;
    userProtectorPhone: string;
    patientSymptom: string;
    patientMedications: string[];
    patientDiseases: string[];
}

// 이송 수락 내역 조회
export interface AcceptedTransfer {
    transferAcceptAt: string;
    transferArriveAt: string;
    dispatchId: number;  // id로 연결
    hospital: Hospital;
}


// 병원 정보
export interface Hospital {
    hospitalName: string;
    locationPoint: string;
}



// 전체 이송신청 목록 + 수락 목록  -> 연결하기 위해
export interface CombinedTransfer extends TransferData {  // TransferData 상속
    transferAcceptAt: string | null;  // 수락 시간
    transferArriveAt: string | null;  // 도착 시간
    hospital: Hospital | null;
}