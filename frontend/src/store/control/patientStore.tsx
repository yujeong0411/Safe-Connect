import { create } from 'zustand';
import { PatientInfo, PatientStore, CallInfo } from '@/types/common/Patient.types.ts';
import { patientService, protectorService } from '@features/control/services/controlApiService.ts';

export const usePatientStore = create<PatientStore>((set) => ({
  patientInfo: null,
  currentCall: null, // 현재 처리 중인 신고 정보

  // 현재 신고
  setCurrentCall: (callInfo: CallInfo) => {
    set({ currentCall: callInfo });
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
      const response = await patientService.savePatientInfo(info);
      if (response.isSuccess) {
        set({
          patientInfo: response.data as PatientInfo,
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
