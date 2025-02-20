// 상황실 신고 내역 조회
export interface CallRecord {
  callId: number;
  callIsDispatched: boolean;
  callSummary: string;
  callText: string;
  callStartedAt: string;
  callFinishedAt: string;
  patientId?: number;
  userName?: string;
  caller:Caller;

}

export interface Caller{
  callerId:string;
  callerPhone:string;
  callerName:string;
}

export interface CallListResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: CallRecord[] | CallRecord;
}

export interface CallListStore {
  callList: CallRecord[];
  callDetail: CallRecord | null; // 상세 조회 데이터 추가
  fetchCallList: () => Promise<void>;
  fetchCallDetail: (callId: number) => Promise<void>;
}
