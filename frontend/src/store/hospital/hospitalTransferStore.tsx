import {create} from 'zustand'
import {TransferStore} from "@/types/hospital/hospitalTransfer.types.ts";
import {fetchTransferRequest, fetchTransferDetail} from "@features/hospital/services/hospitalApiService.ts";

export const useHospitalTransferStore = create<TransferStore>((set) => ({
    transfers:[],  // 이송요청 목록
    originalTransfers:[],

    // 이송 요청 조회
    fetchTransfers: async () => {
        try {
            const response = await fetchTransferRequest();
            set({transfers:response.data, originalTransfers:response.data})
            return response.data;
        } catch (error) {
            console.error("이송 조회 실패", error);
            throw error;
        }
    },

    fetchTransferDetail: async (dispatchId:number) => {
        try {
            const response = await fetchTransferDetail(dispatchId);
            if (response.length > 0) {
                return response[0];  // 배열의 첫 번째 항목 반환
            }
            throw new Error('상세 데이터가 없습니다');
        } catch (error) {
            console.error("이송 상세조회 실패", error)
            throw error;
        }
    },
}))