// 구급대 그룹 정보를 나타내는 인터페이스
export interface DispatchGroup {
  fireDeptId: number;
  dispatchGroupId: number;
  fireDeptName: string;
}


export interface DispatchGroupStore {
  dispatchGroups: DispatchGroup[];
  selectedStation: string | null;
  fetchDispatchGroups: () => Promise<void>;
  setSelectedStation: (station: string | null) => void;
  sendDispatchOrder: (dispatchGroupId:number) => void;
}

export interface DispatchGroupResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: DispatchGroup[];
}