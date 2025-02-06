export interface TransferResponse {
    isSuccess: boolean;
    code: number;
    message: string;
    data: TransferData[]
}
// 이송 신청 내역 조회
export interface TransferData {
    dispatchId: number
    fireDeptName:string // 관할 소방서
    reqHospitalCreatedAt: string  // 요청 시간
    dispatchIsTransfer: boolean // 이송 여부
    patients: patients[]
}

export interface patients {
    patientPreKtas:string
    patientGender:string
    patientAge:string
    patientSymptom:string
}

export interface TransferStore {
    transfers: TransferData[]
    originalTransfers: TransferData[];  // 날짜 필터링
    fetchTransfers: (type: 'request' | 'accept') => Promise<void>;
    fetchTransferDetail: (dispatchId: number, type: 'request' | 'accept') => Promise<PatientDetail>;
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

// 이송 신청 상세 조회
// export interface TransferDetailData {
//
// }