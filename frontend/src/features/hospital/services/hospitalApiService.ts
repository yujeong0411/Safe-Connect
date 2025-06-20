import {axiosInstance} from "@utils/axios.ts";
import {AcceptedTransferResponse, TransferResponse} from "@/types/hospital/hospitalTransfer.types.ts";

// 이송 요청 목록
export const fetchTransferRequest = async (): Promise<TransferResponse> => {
    try {
        const response = await axiosInstance.get<TransferResponse>('/hospital/transfer_request')
        return response.data
    } catch (error) {
        console.error("이송 내역 조회 실패", error)
        throw error;
    }
}

// 이송 요청 상세목록
export const fetchTransferDetail = async (dispatchId: number) => {
    try {
        const response = await axiosInstance.get('hospital/transfer_request/detail', {params: {dispatchId}})
        return response.data
    } catch (error) {
        console.error("이송 상세 조회 실패", error)
        throw error;
    }
}

// 수락한 이송 목록
export const fetchAcceptedTransfer = async (): Promise<AcceptedTransferResponse> => {
    try {
        const response = await axiosInstance.get<AcceptedTransferResponse>('/hospital/transfer_accepted');
        return response.data;
    } catch (error) {
        console.error("수락한 이송 목록 실패", error)
        throw error;
    }
}


// 수락한 이송 상세
export const fetchAcceptedTransferDetail = async (dispatchId: number) => {
    try {
        const response = await axiosInstance.get('hospital/transfer_accepted/detail', {params: {dispatchId}})
        return response.data;
    } catch (error) {
        console.error("수락한 이송 상세 실패", error)
        throw error;
    }
}

// 이송 신청 응답 (수락/거절)
export const updateTransferStatus = async (patientId:number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
        const response = await axiosInstance.post('hospital/transfer/status', {patientId, status})
        return response.data
    } catch (error) {
        console.error("이송 답변 실패", error)
        throw error;
    }
}
