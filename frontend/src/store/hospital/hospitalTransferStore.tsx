import {create} from 'zustand'
import {TransferStore, CombinedTransfer, AcceptedTransfer} from "@/types/hospital/hospitalTransfer.types.ts";
import {fetchTransferRequest, fetchTransferDetail, fetchAcceptedTransfer, updateTransferStatus} from "@features/hospital/services/hospitalApiService.ts";

export const useHospitalTransferStore = create<TransferStore>((set) => ({
    combinedTransfers: [], // 이송목록 + 수락목록

    // 이송 요청 조회
    fetchCombinedTransfers: async () => {
        try {
           const [transferList, acceptedList] = await Promise.all([
               fetchTransferRequest(),
               fetchAcceptedTransfer()
           ])

            // 통합 데이터
            const combined = transferList.data.map(transfer => {
                // dispatchId로 연결
                const acceptedInfo = acceptedList.data.find(accepted => accepted.dispatchId === transfer.dispatchId)
                    return {
                     ...transfer,
                        transferAcceptAt: acceptedInfo?.transferAcceptAt || null,
                        transferArriveAt: acceptedInfo?.transferArriveAt || null,
                        hospital: acceptedInfo?.hospital || null,
                    } as CombinedTransfer
            })
            // 통합 데이터 설정
            set({
                combinedTransfers: combined,
            })
            return transferList.data  // TransferData[] 반환
        } catch (error) {
            console.error("통합 이송목록 조회 실패", error)
            throw error
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
            //console.error("이송 상세조회 실패", error)
            throw error;
        }
    },

    updateTransferStatus: async (patientId: number, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            const response = await updateTransferStatus(patientId, status);

            // 상태 변경 후 목록 새로고침
            const [transferList, acceptedList] = await Promise.all([
                fetchTransferRequest(),
                fetchAcceptedTransfer()
            ])

            // 통합 데이터 새로 생성
            const combined = transferList.data.map(transfer => {
                const acceptedInfo = acceptedList.data.find(
                    accepted => accepted.dispatchId === transfer.dispatchId
                ) as AcceptedTransfer | undefined;

                return {
                    ...transfer,
                    transferAcceptAt: acceptedInfo?.transferAcceptAt || null,
                    transferArriveAt: acceptedInfo?.transferArriveAt || null,
                    hospital: acceptedInfo?.hospital || null,
                } as CombinedTransfer
            });

            // 통합 데이터 업데이트
            set({ combinedTransfers: combined });
            return response;

        } catch (error) {
            console.error("이송상태 변경 실패", error)
            throw error
        }
    }
}))