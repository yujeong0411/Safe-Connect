import { create } from 'zustand';
import { PatientInfo, PatientStore, CallInfo } from '@/types/common/Patient.types.ts';
import { patientService, protectorService } from '@features/control/services/controlApiService.ts';

export const usePatientStore = create<PatientStore>((set) => ({
  patientInfo: null,
  isLoading: false,
  error: null,
  isError: false,

  searchByPhone: async (callerPhone: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await patientService.searchByPhone(callerPhone);
      console.log('전화번호 조회 응답', response);
      if (response.isSuccess) {
        set({
          patientInfo: response.data as PatientInfo,
          isLoading: false,
          isSuccess: true,
        });
        return response;
      } else {
        set({
          error: response.message,
          isLoading: false,
          isSuccess: false,
        });
      }
    } catch (error) {
      set({ error: '환자 정보를 찾을 수 없습니다.', isLoading: false, isSuccess: false });
    }
  },

  // 신고 내용 저장(수정)
  savePatientInfo: async (info: CallInfo) => {
    try {
      set({ isLoading: true, error: null });
      const response = await patientService.savePatientInfo(info);
      if (response.isSuccess) {
        set({
          patientInfo: response.data as PatientInfo,
          isLoading: false,
          isSuccess: true,
        });
      }
    } catch (error) {
      set({ error: '정보 저장에 실패했습니다.', isLoading: false, isSuccess: false });
    }
  },

  resetPatientInfo: async () => {
    set({ patientInfo: null, error: null });
  },
  messageStatus: null,
  sendProtectorMessage: async (patientId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await protectorService.sendProtectorMessage(patientId);

      if (response.isSuccess) {
        set({ messageStatus: response.data, isLoading: true });
        return true;
      } else {
        set({
          error: response.message,
          isLoading: false,
        });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.message || '보호자 메시지 전송 중 오류 발생',
        isLoading: false,
      });
      return false;
    }
  },
}));
