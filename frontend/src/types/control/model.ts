export interface Call {
  callId: number;
  callIsDispatch: boolean;
  callSummary: string;
  callText: string;
  callTextCreatedAt: string;

  // 추가 정보들
  fireStaffId: number; // 신고 접수 상황실 직원 ID
  callerId: number; // 신고자 ID
  callStartAt: string; // 신고 시작 시간
  callFinishAt?: string; // 신고 종료 시간
  callerName?: string; // 신고자 이름
  callerPhone: string; // 신고자 전화번호
  callerIsUser: boolean; // 신고자가 기존 사용자인지 여부
}
