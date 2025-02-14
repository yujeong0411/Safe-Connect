import { create } from 'zustand';
import {
  CurrentCall,
  DispatchPatientStore,
    DispatchFormData,
    DispatchSavePatientRequest
} from '@/types/common/Patient.types.ts';
import { updateDispatchPatientInfo } from '@features/dispatch/sevices/dispatchServiece.ts';

const initialFormData: DispatchFormData = {
  patientName: '',
  patientGender: '',
  patientAge: '',
  patientBloodSugar: null,
  patientDiastolicBldPress: null,
  patientSystolicBldPress: null,
  patientPulseRate: null,
  patientTemperature: null,
  patientSpo2: null,
  patientMental: '',
  patientPreKtas: '',
  patientSymptom: '',
  diseases: '',
  medications: '',
  patientPhone: '',
  patientProtectorPhone:'',
  callSummary: ''
};

export const useDispatchPatientStore = create<DispatchPatientStore>((set, get) => ({
  baseInfo: null,
  formData: initialFormData,

  initialBaseInfo: (info: CurrentCall) => {
    set({
      baseInfo: info,
      formData: {
        ...initialFormData,
        // 상황실에서 온 정보가 있다면 해당 정보로 초기화
        patientName: info.userName ?? '',
        patientGender: info.userGender ?? '',
        patientAge: info.userAge ?? '',
        patientPhone: info.userPhone ?? '',
        patientProtectorPhone: info.userProtectorPhone ?? '',
        callSummary: info.callSummary ?? '',
        diseases: info.diseases ?? '',
        medications: info.medications ?? '',
        patientSymptom: info.symptom ?? ''
      }
    });
  },

  // 정보가 없을 경우 구급대원이 자유롭게 입력 가능
  updateFormData: (data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        ...data
      }
    }));
  },


  // 환자 정보 저장
  savePatientInfo: async () => {
    const {formData, baseInfo} = get()
    if (!baseInfo?.patientId) {
      throw new Error('환자 ID가 없습니다.');
    }

    try {
      // 정보가 없으면 구급대원이 입력한 정보로 저장
      const requestData: DispatchSavePatientRequest = {
        patientId: baseInfo.patientId,
        patientName: formData.patientName,
        patientGender: formData.patientGender,
        patientAge: formData.patientAge,
        patientSymptom: formData.patientSymptom,
        patientPhone: formData.patientPhone,
        patientProtectorPhone:formData.patientProtectorPhone,
        callSummary:formData.callSummary,
        vitalSigns: {
          patientBloodSugar: formData.patientBloodSugar,
          patientDiastolicBldPress: formData.patientDiastolicBldPress,
          patientSystolicBldPress: formData.patientSystolicBldPress,
          patientPulseRate: formData.patientPulseRate,
          patientTemperature: formData.patientTemperature,
          patientSpo2: formData.patientSpo2,
          patientMental: formData.patientMental,
          patientPreKtas: formData.patientPreKtas
        }
      };

      const response = await updateDispatchPatientInfo(requestData);

      if (response.isSuccess) {
        return response.data
      }
    } catch (error) {
      console.error('저장 중 오류 발생', error);
      throw error;
    }
  },


  resetPatientInfo: () => {
    set({
      baseInfo: null,
     formData: initialFormData,
    });
  },
}));
