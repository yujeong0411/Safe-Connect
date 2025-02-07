import {axiosInstance} from "@utils/axios.ts";
import {AcceptedTransferResponse, TransferResponse} from "@/types/hospital/hospitalTransfer.types.ts";

// 이송 요청 목록
export const fetchTransferRequest = async (): Promise<TransferResponse> => {
    try {
        const response = await axiosInstance.get<TransferResponse>('/hospital/transfer_request')
        console.log("이송 내역 조회 성공", response.data);
        return response.data
    } catch (error) {
        console.error("이송 내역 조회 실패", error)
        throw error;
    }
}

// 이송 요청 상세목록
export const fetchTransferDetail = async (dispatchId: number) => {
    try {
        console.log('요청 dispatchId:', dispatchId);
        const response = await axiosInstance.get('hospital/transfer_request/detail', {params: {dispatchId}})
        console.log("이송 신청 응답", response.data)
        return response.data
    } catch (error) {
        console.error("이송 상제 조회 실패", error)
        throw error;
    }
}

// 수락한 이송 목록
export const fetchAcceptedTransfer = async (): Promise<AcceptedTransferResponse> => {
    try {

        const response = await axiosInstance.get<AcceptedTransferResponse>('/hospital/transfer_accepted');
        console.log("수락한 이송 응답", response.data)
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
        console.log("이송 상세 응답", response.data)
        return response.data;
    } catch (error) {
        console.error("수락한 이송 상세 실패", error)
        throw error;
    }
}

// 스토어로 이동
// export const useAcceptedTransfer = () => {
//     const [combinedTransfer, setCombinedTransfer] = useState<CombinedTransfer[]>([])
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [transferList, acceptedList] = await Promise.all([
//                     fetchTransferRequest(),
//                     fetchAcceptedTransfer(),
//                 ])
//
//                 const combined = transferList.data.map(transfer => {
//                     const acceptedInfo = acceptedList.data.find(
//                         accepted => accepted.dispatchId === transfer.dispatchId
//                     )
//                     return {
//                         dispatchId: transfer.dispatchId,
//                         fireDeptName: transfer.fireDeptName,
//                         reqHospitalCreatedAt: transfer.reqHospitalCreatedAt,
//                         dispatchIsTransfer: transfer.dispatchIsTransfer,
//                         patients: transfer.patients,
//                         acceptedTransfer: acceptedInfo || null
//                     } as CombinedTransfer
//                 })
//
//                 setCombinedTransfer(combined)
//             } catch (error) {
//                 console.error("병합 이송신청 조회 실패", error)
//             }
//         };
//         fetchData();
//     }, [])
//     return { data:combinedTransfer}
// }