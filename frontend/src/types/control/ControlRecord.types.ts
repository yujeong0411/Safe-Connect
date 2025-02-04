// 상황실 신고 내역 조회
export interface CallRecord {
  callId: number;
  callIsDispatched: boolean;
  callSummary: string;
  callText: string;
  callStartedAt: string;
  callFinishedAt: string;
}

export interface CallListResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: CallRecord[];
}

export interface CallListStore {
  callList: CallRecord[];
  isLoading: boolean;
  error: string | null;
  fetchCallList: () => Promise<void>;
}
