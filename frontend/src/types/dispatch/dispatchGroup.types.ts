import { BaseResponse, DispatchOrderData } from "@/types/sse/sse.types";

// 구급대 그룹 정보를 나타내는 인터페이스
export interface DispatchGroup {
  fireDeptId: number;
  dispatchGroupId: number;
  fireDeptName: string;
}


export interface DispatchGroupStore {
  dispatchGroups: DispatchGroup[];
  selectedStation: string | null;
  lastDispatchResponse: BaseResponse<DispatchOrderData> | null;
  fetchDispatchGroups: () => Promise<void>;
  setSelectedStation: (station: string | null) => void;
}

export interface DispatchGroupResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: DispatchGroup[];
}