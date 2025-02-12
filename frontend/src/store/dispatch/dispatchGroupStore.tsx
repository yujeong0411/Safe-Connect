import { create } from 'zustand/index';
import { DispatchGroupStore } from '@/types/dispatch/dispatchGroup.types.ts';
import { fetchDispatchGroups } from '@features/control/services/controlApiService.ts';

export const useDispatchGroupStore = create<DispatchGroupStore>((set, get) => ({
  dispatchGroups: [],
  selectedStation: null,
  lastDispatchResponse: null,

  // 출동 그룹 불러오기
  fetchDispatchGroups: async () => {
    try {
      const response = await fetchDispatchGroups();
      const selectedStation = get().selectedStation;

      // 이전 소방팀의 목록이 잠깐 노출되는 것 해결
      if (!selectedStation) {
        set({ dispatchGroups: [] }); // 선택된 소방서에 팀이 없으면 빈 배열 설정
        return;
      }

      // 소방서 이름 정규화
      const normalizeStationName = (name: string) => {
        return name.replace(/광주|소방서/g, '').trim();
      };

      // 정규화된 소방서 이름
      const normalizedStationName = normalizeStationName(selectedStation);

      // 선택된 소방서의 소방팀 필터링
      const filterGroups = response.data.filter(
        (group) => normalizeStationName(group.fireDeptName) === normalizedStationName
      );

      set({ dispatchGroups: filterGroups });
    } catch (error) {
      console.log('소방팀 조회 실패', error);
      set({ dispatchGroups: [] }); // 이전 항목 랜더링 방지
    }
  },

  // 선택한 소방팀 다시 필터링
  setSelectedStation: (station) => {
    // 소방서 선택 시 즉시 dispatchGroups 비우기 (이전 항목 랜더링 방지)
    set({
      selectedStation: station,
      dispatchGroups: [],
    });

    // 소방서가 바뀔 때마다 소방팀 다시 필터링
    get().fetchDispatchGroups();
  },


}));
