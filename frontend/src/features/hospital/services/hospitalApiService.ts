import {axiosInstance} from "@utils/axios.ts";
import { TransferResponse} from "@/types/hospital/hospitalAuth.types.ts";


// 이송 요청 목록
export const fetchTransferRequest = async (hospitalId:number): Promise<TransferResponse> => {
    try {
        const response = await axiosInstance.get<TransferResponse>('/hospital/transfer_request', {params: {hospitalId}})
        console.log("이송 내역 조회 성공", response.data);
        return response.data
    } catch (error) {
        console.error("이송 내역 조회 실패", error)
        throw error;
    }
}

// 수락한 이송 목록
export const fetchAcceptedTransfer = async (hospitalId:number): Promise<TransferResponse> => {
    try {
        const response = await axiosInstance.get<TransferResponse>('/hospital/transfer_accepted', {params:{hospitalId}})
        return response.data
    } catch (error) {
        console.error("수락한 이송 목록 실패", error)
        throw error;
    }
}
