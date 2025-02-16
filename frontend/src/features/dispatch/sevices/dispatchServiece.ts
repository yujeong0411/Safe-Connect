import {axiosInstance} from "@utils/axios.ts";
import {
    DispatchSavePatientRequest,
    DispatchSavePatientResponse,
    PreKtasAIRequest,
    PreKtasAIResponse
} from "@/types/common/Patient.types.ts";
import { DispatchResponse, PatientDetailResponse } from '@/types/dispatch/dispatchRecord.types.ts';

export const updateDispatchPatientInfo = async (patientInfo: DispatchSavePatientRequest):Promise<DispatchSavePatientResponse> => {
    try {
        console.log("구급대원 환자 정보 저장 시도",patientInfo);
        const response = await axiosInstance.put<DispatchSavePatientResponse>('/dispatch_staff/patient_info', patientInfo);
        console.log("구급대원 환자 정보 저장 응답", response);
        return response.data
    } catch (error) {
        console.log("구급대원 환자정보 저장 실패", error)
        throw error;
    }
}

export const preKtasAI = async (params:PreKtasAIRequest) :Promise<PreKtasAIResponse> => {
    try {
        console.log("prektas 시도", params)
        const response = await axiosInstance.post<PreKtasAIResponse>('/dispatch_staff/patient/pre_ktas', params);
        console.log("prektas 응답", response.data)
        return response.data
    } catch (error) {
        console.log("prektas 실패", error)
        throw error;
    }
}

// 보호자 메세지 전송
export const sendProtectorMessage = async (patientId: number, transferId:number)=> {
    try {
        const response = await axiosInstance.post('/dispatch_staff/patient/call', {patientId, transferId})
        console.log("메세지 전송 성공", response.data)
        return response.data
    } catch (error) {
        console.log("보호자 메세지 전송 실패", error)
        throw error;
    }
}

// 이송 내역 전체 조회
export const getDispatchReport = async ():Promise<DispatchResponse> => {
    try {
        const response = await axiosInstance.get('/dispatch_staff/report')
        console.log("report 조회 성공", response.data)
        return response.data
    } catch (error) {
        console.log("report 조회 실패", error)
        throw error;
    }
}

// 이송 내역 전체 조회
export const getDispatchDetailReport = async (dispatchId:number):Promise<PatientDetailResponse> => {
    try {
        const response = await axiosInstance.get('/dispatch_staff/report/detail'
          ,{params:{dispatchId}}
    )
        console.log("report 조회 성공", response.data)
        return response.data
    } catch (error) {
        console.log("report 조회 실패", error)
        throw error;
    }
}