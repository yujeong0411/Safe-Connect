import { axiosInstance } from '@utils/axios.ts';
import {
  PatientResponse,
  CallInfo,
  ProtectorMessageResponse, CallSummaryResponse,
} from '@/types/common/Patient.types.ts';
import { CallListResponse } from '@/types/control/ControlRecord.types.ts';
import {DispatchGroupResponse} from "@/types/dispatch/dispatchGroup.types.ts";

export const patientService = {
  // 신고자 전화번호 검색
  searchByPhone: async (phone: string): Promise<PatientResponse> => {
    try {
      console.log('API 호출 전화번호:', phone);
      const response = await axiosInstance.get<PatientResponse>('/control/medi_list', {
        params: { callerPhone: phone },
      });
      console.log('API 응답:', response);
      return response.data;
    } catch (error: any) {
      // 구체적인 에러 처리
      console.error('searchByPhone 에러:', error);
      if (error.response) {
        // 서버에서 반환한 에러 메시지 그대로 throw
        throw new Error(error.response.data.message || '환자 정보 조회 중 오류 발생');
      }
      throw error;
    }
  },

  // 환자 정보 저장
  savePatientInfo: async (info: CallInfo): Promise<PatientResponse> => {
    try {
      console.log('저장할 정보:', info);
      const response = await axiosInstance.put<PatientResponse>('/control/call', info);
      console.log('저장 응답:', response);
      return response.data;
    } catch (error: any) {
      console.error('savePatientInfo 에러:', error);
      if (error.response) {
        throw new Error(error.response.data.message || '환자 정보 저장 중 오류 발생');
      }
      throw error;
    }
  },
};

export const controlService = {
  // 신고 전체 조회
  fetchCallList: async (): Promise<CallListResponse> => {
    try {
      console.log('API 호출 시작');
      const response = await axiosInstance.get<CallListResponse>('/control/call');

      console.log('API 직접 응답:', {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: any) {
      console.error('API 호출 중 에러:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  // 신고 상세 조회
  fetchCallDetail: async (callId: number): Promise<CallListResponse> => {
    try {
      const response = await axiosInstance.get<CallListResponse>('/control/call/detail', {
        params: { callId },
      });
      return response.data;
    } catch (error: any) {
      console.log('신고 상세 조회 실패', error.message);
      throw error;
    }
  },

  // 신고 종료
  endCall : async (callId:number): Promise<CallListResponse> => {
    try {
      const response = await axiosInstance.put<CallListResponse>('/control/call_end', {callId})
      console.log("상황실 신고 종료", response);
      return response.data
    } catch (error: any) {
      console.error("신고 종료 실패", error);
      throw error;
    }
  },
  
  // URL 재전송
  resendUrl: async (callId:number): Promise<CallListResponse> => {
    try {
      const response = await axiosInstance.post<CallListResponse>('/control/resend', {callId});
      console.log("url 재전송", response)
      return response.data
    } catch (error: any) {
      console.error("url 재전송 실패", error)
      throw error;
    }
  },

  // 신고내용 요약
  callSummary: async (callId:number): Promise<CallSummaryResponse> => {
    try {
      const response = await axiosInstance.post<CallSummaryResponse>('/control/summary', {params:{callId}})
      console.log("신고내용 요약", response.data)
      return response.data
    } catch (error: any) {
      console.error("신고내용 요약 실패", error)
      throw error;
    }
  },
};

// 상황실 보호자 알림.
export const protectorService = {
  sendProtectorMessage: async (callerPhone: string): Promise<ProtectorMessageResponse> => {
    try {
      const response = await axiosInstance.post<ProtectorMessageResponse>('/control/message', {
        callerPhone,
      });
      return response.data;
    } catch (error: any) {
      console.error('보호자 메세지 전송 실패', error);
      throw error;
    }
  },
};

// 가용 가능한 출동 그룹 조회
export const fetchDispatchGroups = async () => {
  try{
    const response = await axiosInstance.get<DispatchGroupResponse>('/control/dispatch_group')
    console.log("소방팀 조회", response.data);
    return response.data;
  } catch (error: any) {
    console.error('소방팀 조회 실패', error)
    throw error;
  }
}

// 출동 지령
export const orderDispatch = async (dispatchGroupId:number, callId:number) => {
    try {
      const response = await axiosInstance.post<DispatchGroupResponse>('/control/dispatch_group_order', {dispatchGroupId, callId})
      console.log("출동 지령 성공", response.data);
      return response.data;
    } catch (error: any) {
      console.error('출동 지령 실패', error)
      throw error;
    }
  }
