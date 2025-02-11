import {CallInfo} from "@/types/common/Patient.types.ts";
import {PatientInfo} from "@/types/common/Patient.types.ts";
import {PatientDetail} from "@/types/hospital/hospitalTransfer.types.ts";

// 기본 응답 타입 템플릿 생성
export interface BaseResponse<T> {
    isSuccess: boolean;
    code: number;
    message: string;
    data: T;
}

export interface UseSSEProps<T> {
    subscribeUrl: string;
    clientId: number;
    onMessage: (data: BaseResponse<T>) => void;
    onError?: (error: unknown) => void; // unknown 타입 사용 권장
}


// 상황실-구급팀
export interface DispatchOrderData {
    dispatchGroupId: number;
    callId: number;
}

// // 구급팀-병원 (구급팀)
// interface DispatchToHospitalData {
//     dispatchId: number;
//     hospitalIds: number[];
//     patientId: number;
// }

export interface Patient extends PatientInfo, PatientDetail {
    patientId: number;
    callId: number | null;
    dispatchId: number | null;
    transferId: number | null;
    patientIsUser: boolean;
    patientCreatedAt: string;
    patientInfoCreatedAt: string | null;
    call: CallInfo | null;   // 필요시
    dispatch: unknown | null;   // 필요시
    transfer: unknown | null;  // 필요시
    user: unknown | null;    // 필요시
    dispatchGroup: unknown | null;    // 필요시
}

export interface HospitalTransferData {
    patient: Patient;
    dispatchId: number;
    mediInfo: unknown | null;
}