import {create} from 'zustand'
import { TransferStore} from "@/types/hospital/hospitalAuth.types.ts";
import {fetchTransferRequest} from "@features/hospital/services/hospitalApiService.ts";

export const useHospitalTransferStore = create<TransferStore>((set) => ({
    transfers:[],

    fetchTransfers: async (hospitalId:number) => {
        try {
            const response = await fetchTransferRequest(hospitalId);
            set({transfers:response.data})
        } catch (error) {
            console.error("이송 조회 실패", error);
        }
    },
}))