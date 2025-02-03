// 소방청 정보를 나타내는 인터페이스
export interface FireDept {
  fireDeptId: number; // 소방청의 고유 식별자
  fireDeptName: string; // 소방청 이름
  fireDeptPhone: string; // 소방청 연락처 전화번호
  fireDeptRegion: string; // 소방청 관할 지역
  fireDeptAddress: string; // 소방청 주소
}

// 병원 정보를 나타내는 인터페이스
export interface Hospital {
  hospitalId: string; // 병원의 고유 식별자
  hospitalLoginId: string; // 병원 로그인 ID
  hospitalName: string; // 병원 이름
  latitude: number; // 병원 위도
  longitude: number; // 병원 경도
  hospitalPhone: string; // 병원 연락처 전화번호
}
