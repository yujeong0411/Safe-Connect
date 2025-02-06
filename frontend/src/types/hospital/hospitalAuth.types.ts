export interface HospitalLoginRequest {
  hospitalLoginId: string;
  hospitalPassword: string;
}

export interface HospitalAuthStore {
  token: string | null;
  isAuthenticated: boolean;
  login: (data: HospitalLoginRequest) => Promise<void>; // 타입 변경
  logout: () => void;
}

// 이송 신청 보낼 시
export interface TransferRequest {
  hospitalId: number
}

// 이송 신청 내역 조회
export interface TransferData {
  fireDeptId: number  // 소방서
  transferAcceptAt: string  // 수락일시
  transferIsComplete: boolean // 도착여부
  patientGender: string
  patientAge: string
}

export interface TransferResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: TransferData[]
}

export interface TransferStore {
  transfers: TransferData[]
  fetchTransfers: (hospitalId: number) => Promise<void>
}


// 이송 신청 상세 조회
export interface TransferDetailRequest {
  transferId: number
}

// 이송 신청 상세 조회
// export interface TransferDetailData {
//
// }