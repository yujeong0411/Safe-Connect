// 구급대 그룹 정보를 나타내는 인터페이스
export interface DispatchGroup {
  dispatchDeptId: number;  // 소방서 
  dispatchGroupId: number;  // 그룹
}


export interface DispatchGroupStore {
  dispatchGroups: DispatchGroup[];
  selectedStation: string | null;
  fetchDispatchGroups: () => Promise<void>;
  setSelectedStation: (station: string | null) => void;
}

export interface DispatchGroupResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: DispatchGroup[];
}