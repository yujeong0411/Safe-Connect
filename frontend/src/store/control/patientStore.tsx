import { create } from 'zustand';
import { PatientInfo, PatientStore, CallInfo, CurrentCall } from '@/types/common/Patient.types.ts';
import { patientService, protectorService } from '@features/control/services/controlApiService.ts';

export const usePatientStore = create<PatientStore>((set, get) => ({
  patientInfo: null,
  currentCall: null, // 현재 처리 중인 신고 정보

  // 현재 신고
  setCurrentCall: (info:CurrentCall ) => {
    set({ currentCall: info });
  },

  searchByPhone: async (callerPhone: string) => {
    try {
      const response = await patientService.searchByPhone(callerPhone);
      console.log('전화번호 조회 응답', response);
      if (response.isSuccess) {
        set({ patientInfo: response.data as PatientInfo });
        return response;
      }
    } catch (error) {
      set({ error: '환자 정보를 찾을 수 없습니다.', isLoading: false, isSuccess: false });
    }
  },

  // 신고 내용 저장(수정)
  savePatientInfo: async (info: CallInfo) => {
    try {
      const { currentCall, patientInfo } = get();  // 내부 상태 가져오기
      // 현재 선택된 회원 ID와 신고 ID 추가
      const callInfo = {
        //callId: currentCall?.callId,  // 또는 별도로 관리되는 callId
        callId: 2,  // 테스트 위해(전화가 되어야 callId 생성)
        userId: patientInfo?.userId || null,  // 검색된 회원의 ID, 회원이 아니라면 null
        symptom: info.symptom,
        callSummary: info.callSummary,
        //callText: info.callText
        callText: "테스트"

      };

      const response = await patientService.savePatientInfo(callInfo);
      if (response.isSuccess) {
        set({
          patientInfo: response.data as PatientInfo,
          currentCall:callInfo,  // 저장 성공 시 현재 신고 정보 업데이트
        });
      }
    } catch (error) {
      console.error('정보 저장 실패', error);
    }
  },

  resetPatientInfo: async () => {
    set({ patientInfo: null });
  },

  // 보호자 문자 전송
  sendProtectorMessage: async (callerPhone: string) => {
    try {
      const response = await protectorService.sendProtectorMessage(callerPhone);
      return response.isSuccess;
    } catch (error: any) {
      console.error('보호자 문자 전송 실패', error);
    }
  },
}));
