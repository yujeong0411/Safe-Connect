import { create } from 'zustand';
import { controlService } from '@features/control/services/controlApiService.ts';
import { CallListStore } from '@/types/control/ControlRecord.types.ts';

export const useCallListStore = create<CallListStore>((set) => ({
  callList: [],
  isLoading: false,
  error: null,

  fetchCallList: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await controlService.fetchCallList();

      if (response.isSuccess) {
        set({
          callList: response.data,
          isLoading: false,
        });
      } else {
        set({
          error: response.message,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || '신고내역 조회 중 오류 발생',
        isLoading: false,
      });
    }
  },

  fetchCallDetail: async (callId: number) => {
    try {
      set({ isLoading: true, error: null });

      const response = await controlService.fetchCallDetail(callId);

      if (response.isSuccess) {
        set({
          callDetail: response.data,
          isLoading: false,
        });
      } else {
        set({
          error: response.message,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || '신고내역 상세조회 중 오류 발생',
        isLoading: false,
        callDetail: null,
      });
    }
  },
}));
