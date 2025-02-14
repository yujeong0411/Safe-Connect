import { create } from 'zustand';
import {
  CurrentCall,
  DispatchPatientStore,
  DispatchSavePatientRequest,
  VitalSigns,
} from '@/types/common/Patient.types.ts';
import { updateDispatchPatientInfo } from '@features/dispatch/sevices/dispatchServiece.ts';

const initialVitalSigns: VitalSigns = {
  patientBloodSugar: 0,
  patientDiastolicBldPress: 0,
  patientSystolicBldPress: 0,
  patientPulseRate: 0,
  patientTemperature: 0,
  patientSpo2: 0,
  patientMental: '',
  patientPreKtas: '',
};


export const useDispatchPatientStore = create<DispatchPatientStore>((set, get) => ({
  baseInfo: null,
  vitalSigns: initialVitalSigns,

  // 스토어 상태 업데이트
  initialBaseInfo: (info: CurrentCall) => {
    set({
      baseInfo: {
        patientId: info.patientId,
        patientName: info.userName ?? '',
        patientGender: info.userGender ?? '',
        patientAge: info.userAge ?? '',
        diseases: info.diseases ?? '',
        medications: info.medications ?? '',
        symptom: info.symptom ?? '',
        callSummary: info.callSummary,
      },
    });
  },

  // 환자 v/s 업데이트
  updateVitalSigns: (signs:Partial<VitalSigns>) => {
    set((state) => ({
      vitalSigns: { ...state.vitalSigns, ...signs }
    }));
  },

  // 환자 정보 저장
  savePatientInfo: async () => {
    const { baseInfo, vitalSigns } = get();
    if (!baseInfo || !baseInfo.patientId) return;

    try {
      const patientData: DispatchSavePatientRequest = {
        patientId: baseInfo.patientId,
        patientIsUser: false,
        patientName: baseInfo.patientName,
        patientGender: baseInfo.patientGender as 'M' | 'F',
        patientAge: baseInfo.patientAge,
        patientSymptom: baseInfo.symptom,
        vitalSigns: vitalSigns,
      };

      await updateDispatchPatientInfo(patientData);
      console.log('구급대원 환자 스토어 저장 성공', patientData);
    } catch (error) {
      console.error('구급대원 환자 스토어 저장 실패', error);
      throw error;
    }
  },

  resetPatientInfo: () => {
    set({
      baseInfo: null,
      vitalSigns: initialVitalSigns,
    });
  },
}));
