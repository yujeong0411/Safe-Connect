import {axiosInstance} from "@/utils/axios.ts";
import {
    DispatchSavePatientRequest,
    DispatchSavePatientResponse,
    PreKtasAIRequest,
    PreKtasAIResponse
} from "@/types/common/Patient.types.ts";
import { DispatchResponse, PatientDetailResponse } from '@/types/dispatch/dispatchRecord.types.ts';

export const updateDispatchPatientInfo = async (patientInfo: DispatchSavePatientRequest):Promise<DispatchSavePatientResponse> => {
    try {
        const response = await axiosInstance.put<DispatchSavePatientResponse>('/dispatch_staff/patient_info', patientInfo);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const preKtasAI = async (params:PreKtasAIRequest) :Promise<PreKtasAIResponse> => {
    try {
        const response = await axiosInstance.post<PreKtasAIResponse>('/dispatch_staff/patient/pre_ktas', params);
        return response.data
    } catch (error) {
        console.error("prektas 실패", error)
        throw error;
    }
}

// 보호자 메세지 전송
export const sendProtectorMessage = async (patientId: number, transferId:number)=> {
    try {
        const response = await axiosInstance.post('/dispatch_staff/patient/call', {patientId, transferId})
        return response.data
    } catch (error) {
        console.error("보호자 메세지 전송 실패", error)
        throw error;
    }
}

// 이송 내역 전체 조회
export const getDispatchReport = async ():Promise<DispatchResponse> => {
    try {
        const response = await axiosInstance.get('/dispatch_staff/report')
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("report 조회 실패", error)
        return {
            isSuccess: false,
            code: 500,
            message: '조회에 실패했습니다.',
            data: []
        }
    }
};
        
// 이송 종료(병원 인계 여부 수정 -> 병원 도착시간 기입)
export const completeTransfer = async (transferId: number): Promise<{ isSuccess: boolean; message: string }> => {
    try {
        const response = await axiosInstance.post<{ isSuccess: boolean; message: string }>(
            '/dispatch_staff/transfer/update',
            { transferId }
        );
        return response.data;
    } catch (error) {
        console.error("이송 종료 실패", error);
        throw error;
    }
};

// 현장 도착시간 (영상통화 종료)
export const completeVideo  = async (dispatchId:number):Promise<{ isSuccess: boolean; message: string }> => {
    try {
        const response = await axiosInstance.put<{isSuccess : boolean; message:string;}>('/dispatch_staff/arrive_time', { dispatchId })
        return response.data
    } catch (error) {
        console.error("영상통화 종료 실패", error)
        throw error;
    }
}

// 이송 내역 전체 조회
export const getDispatchDetailReport = async (dispatchId:number):Promise<PatientDetailResponse> => {
    try {
        const response = await axiosInstance.get('/dispatch_staff/report/detail'
          ,{params:{dispatchId}}
    )
        return response.data
    } catch (error) {
        console.error("report 조회 실패", error)
        throw error;
    }
}

// 출동 종료(현장에서 상황종료)
export const completeDispatch = async (dispatchId: number): Promise<{ isSuccess: boolean; message: string }> => {
    try {
        const response = await axiosInstance.post<{ isSuccess: boolean; message: string }>(
            '/dispatch_staff/finish',
            { dispatchId }
        );
        return response.data;
    } catch (error) {
        console.error("출동 종료 실패", error);
        throw error;
    }
};

// 출동 종료(현장에서 상황종료)
export const dispatchDepartAt = async (dispatchId: number): Promise<{ isSuccess: boolean; message: string }> => {
    try {
        const response = await axiosInstance.put<{ isSuccess: boolean; message: string }>(
          '/dispatch_staff/depart_time',
          { dispatchId }
        );
        return response.data;
    } catch (error) {
        console.error("출동 종료 실패", error);
        throw error;
    }
};
export const dispatchLocation = async (sessionId:string,lat:number,lng:number):Promise<{ isSuccess: boolean; message: string }> => {
    try {
        const response = await axiosInstance.post<
          { isSuccess: boolean; message: string }
        >(
          '/dispatch_staff/current_pos',
          {
              sessionId,
              lat,
              lng
          }
        );
        return response.data;
    } catch (error) {
        console.error("위치 정보 전송 실패", error);
        throw error;
    }
}