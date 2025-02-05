import { create } from 'zustand/index';
import {DispatchGroupStore} from "@/types/dispatch/dispatchGroup.types.ts";
import {fetchDispatchGroups} from "@features/control/services/controlApiService.ts";

export const useDispatchGroupStore = create<DispatchGroupStore>((set) => ({
    dispatchGroups: [],
    selectedStation:null,

    fetchDispatchGroups: async () => {
        try {
            const response = await fetchDispatchGroups();
            set({ dispatchGroups: response.data });
        } catch (error) {
            console.error("소방팀 조회 실패", error);
        }
    },

    setSelectedStation: (station) => set({ selectedStation: station }),
}))