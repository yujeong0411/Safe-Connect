// 구급대원 로그인 요청 인터페이스
export interface DispatchStaffLoginRequest {
  fireStaffLogInId: string; // 구급대원 로그인 아이디
  fireStaffPassword: string; // 구급대원 비밀번호
}

// 출동 시간 수정 요청 인터페이스
export interface DispatchDepartTimeRequest {
  dispatchId: number; // 출동 고유 식별자
  dispatchDepartAt: string; // 출동 출발 시간 (ISO 8601 형식 권장)
}

// 구급차 현재 위치 전송 요청 인터페이스
export interface DispatchCurrentPosRequest {
  dispatchGroupId: number; // 구급대 그룹 식별자
  latitude: number; // 현재 위도
  longitude: number; // 현재 경도
}

// 환자 정보 작성 요청 인터페이스
export interface PatientInfoRequest {
  patientIsUser: string; // 환자가 기존 사용자인지 여부
  patientName: string; // 환자 이름
  patientGender: string; // 환자 성별
  patientAge: string; // 환자 나이
  patientBloodSugar: number; // 혈당
  patientDiastolicBloodPressure: number; // 이완기 혈압
  patientSystolicBloodPressure: number; // 수축기 혈압
  patientBreatheRate: number; // 호흡 횟수
  patientTemperature: number; // 체온
  patientSpo2: number; // 산소 포화도
  patientMental: string; // 의식 상태
  patientPreKtas: number; // 사전 응급 중증도 분류 점수
  patientSymptom: string; // 환자 증상
  patientCreatedAt: string; // 정보 생성 시각
  source: File; // 첨부 파일 (예: 의료 기록 등)
}
