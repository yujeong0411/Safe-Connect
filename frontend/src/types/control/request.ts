// 상황실 로그인 요청 인터페이스
export interface ControlLoginRequest {
  fireStaffId: string; // 상황실 직원 로그인 ID
  fireStaffPassword: string; // 상황실 직원 비밀번호
}

// 신고 생성 요청 인터페이스
export interface CallCreateRequest {
  fireStaffId: number; // 신고 접수 상황실 직원의 고유 식별자
  callerId: number; // 신고자의 고유 식별자
  callStartAt: string; // 신고 접수 시작 시간 (ISO 8601 형식)
}

// 출동 요청 인터페이스
export interface DispatchRequest {
  callId: number; // 원본 신고의 고유 식별자
  fireDispatchGroupId: number; // 출동 배정된 소방팀 그룹의 고유 식별자
  dispatchCreateAt: string; // 출동 요청 생성 시간 (ISO 8601 형식)
}
