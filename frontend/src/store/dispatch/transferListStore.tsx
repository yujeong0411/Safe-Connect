import { create } from 'zustand';
import { DispatchListStore, DispatchRecord, PatientDetail } from '@/types/dispatch/dispatchRecord.types.ts';
import { getDispatchDetailReport, getDispatchReport } from '@features/dispatch/sevices/dispatchServiece.ts';


export const useTransferListStore = create<DispatchListStore>((set) => ({
  dispatchList: [],
  dispatchDetail: null,

  fetchDispatchList: async () => {
    try {
      const response = await getDispatchReport();

      if (response.isSuccess) {
        set({
          dispatchList: response.data as DispatchRecord[],
        });
      }
    } catch (error: any) {
      console.error('신고내역 조회 중 오류:', error);
    }
  },

  fetchDispatchDetail: async (dispatchId: number) => {
    try {
      const response = await getDispatchDetailReport(dispatchId);

      if (response.isSuccess) {
        set({
          dispatchDetail: response.data as PatientDetail[],
        });
      }
    } catch (error: any) {
      console.error('상세조회 중 오류:', error);
      set({ dispatchDetail: null });
    }
  },
}));
