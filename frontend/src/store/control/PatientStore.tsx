import { create } from 'zustand';
import { PatientInfo, PatientStore, CallInfo } from '@/types/common/Patient.types.ts';
import { patientService } from '@features/control/services/controlApiService.ts';

export const usePatientStore = create<PatientStore>((set) => ({
  patientInfo: null,
  isLoading: false,
  error: null,

  searchByPhone: async (phone: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await patientService.serarchByPhone(phone);

      if (response.isSuccess) {
        set({
          patientInfo: response.data as PatientInfo,
          isLoading: false,
        });
      } else {
        set({
          error: response.message,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ error: '환자 정보를 찾을 수 없습니다.', isLoading: false });
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
        });
      }
    } catch (error) {
      set({ error: '정보 저장에 실패했습니다.', isLoading: false });
    }
  },

  resetPatientInfo: async () => {
    set({ patientInfo: null, error: null });
  },
}));
