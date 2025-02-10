export interface BaseResponseGeneric<T> {
    isSuccess: boolean;
    code: number;
    message: string;
    data: T;
  }
  
  // 상황실-구급팀
export interface DispatchOrderData {
    dispatchGroupId: number;
    callId: number;
  }
  