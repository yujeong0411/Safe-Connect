export interface AdminLoginRequest {
  adminUserId: string;
  adminUserPassword: string;
}

// 소방청 생성 요청 인터페이스
export interface FireDeptCreateRequest {
  fireDeptName: string; // 소방청 이름
  fireDeptPhone: string; // 소방청 전화번호
  fireDeptRegion: string; // 소방청 관할 지역
  fireDeptAddress: string; // 소방청 주소
}

// 병원 생성 요청 인터페이스
export interface HospitalCreateRequest {
  hospitalLoginId: string; // 병원 로그인 ID
  hospitalPassword: string; // 병원 비밀번호
  hospitalName: string; // 병원 이름
  latitude: number; // 병원 위도
  longitude: number; // 병원 경도
  hospitalPhone: string; // 병원 전화번호
}
