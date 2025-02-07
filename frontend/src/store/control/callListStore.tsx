import { create } from 'zustand';
import { controlService } from '@features/control/services/controlApiService.ts';
import { CallListStore, CallRecord } from '@/types/control/ControlRecord.types.ts';

export const useCallListStore = create<CallListStore>((set) => ({
  callList: [],
  callDetail: null,

  fetchCallList: async () => {
    try {
      const response = await controlService.fetchCallList();

      if (response.isSuccess) {
        set({
          callList: response.data as CallRecord[],
        });
      }
    } catch (error: any) {
      console.error('신고내역 조회 중 오류:', error);
    }
  },

  fetchCallDetail: async (callId: number) => {
    try {
      const response = await controlService.fetchCallDetail(callId);

      if (response.isSuccess) {
        set({
          callDetail: response.data as CallRecord,
        });
      }
    } catch (error: any) {
      console.error('상세조회 중 오류:', error);
      set({ callDetail: null });
    }
  },
}));
