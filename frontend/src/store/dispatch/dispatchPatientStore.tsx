import { create } from 'zustand';
import {
  DispatchPatientStore,
  DispatchFormData,
  DispatchSavePatientRequest,
    PreKtasAIRequest
} from '@/types/common/Patient.types.ts';
import { updateDispatchPatientInfo, preKtasAI, sendProtectorMessage } from '@features/dispatch/sevices/dispatchServiece.ts';

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
  patientProtectorPhone: '',
  callSummary: '',
};

export const useDispatchPatientStore = create<DispatchPatientStore>((set, get) => ({
  formData: initialFormData,

  // SSE로 받은 환자 정보 formData에 설정
  setPatientFromSSE: (data) => {
    set(() => ({
      formData: {
        patientId: data.patient.patientId,
        patientName: data.patient.patientName || '',
        patientGender: data.patient.patientGender || '',
        patientAge: String(data.patient.patientAge) || '',
        patientBloodSugar: data.patient.patientBloodSugar,
        patientDiastolicBldPress: data.patient.patientDiastolicBldPress,
        patientSystolicBldPress: data.patient.patientSystolicBldPress,
        patientPulseRate: data.patient.patientPulseRate,
        patientTemperature: data.patient.patientTemperature,
        patientSpo2: data.patient.patientSpo2,
        patientMental: data.patient.patientMental || '',
        patientPreKtas: String(data.patient.patientPreKtas) || '',
        patientSymptom: data.patient.patientSymptom || '',
        patientPhone: data.patient.patientIsUser ? (data.user?.userPhone || '') : (data.call.callerPhone || ''),
        patientProtectorPhone: data.user?.protectorPhone || '',
        diseases: data.mediInfo
            ?.find((m) => m.categoryName === '기저질환')
            ?.mediList.map((m) => m.mediName)
            .join(',') || '',
        medications: data.mediInfo
            ?.find((m) => m.categoryName === '복용약물')
            ?.mediList.map((m) => m.mediName)
            .join(',') || '',
        callSummary: data.call.callSummary,
      },
    }));
  },

  // 정보가 없을 경우 구급대원이 자유롭게 입력 가능
  updateFormData: (data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    }));
  },

  // 환자 정보 저장
  savePatientInfo: async () => {
    const { formData } = get();
    if (!formData.patientId) {
      throw new Error('환자 ID가 없습니다.');
    }

    try {
      // 정보가 없으면 구급대원이 입력한 정보로 저장
      const requestData: DispatchSavePatientRequest = {
        patientId: formData.patientId,
        patientName: formData.patientName,
        patientGender: formData.patientGender,
        patientAge: formData.patientAge,
        patientSymptom: formData.patientSymptom,
        patientPhone: formData.patientPhone,
        patientProtectorPhone: formData.patientProtectorPhone,
        callSummary: formData.callSummary,
        patientBloodSugar: formData.patientBloodSugar,
        patientDiastolicBldPress: formData.patientDiastolicBldPress,
        patientSystolicBldPress: formData.patientSystolicBldPress,
        patientPulseRate: formData.patientPulseRate,
        patientTemperature: formData.patientTemperature,
        patientSpo2: formData.patientSpo2,
        patientMental: formData.patientMental,
        patientPreKtas: formData.patientPreKtas,
      };

      console.log('저장 요청 데이터:', requestData);  // 요청 데이터 확인
      const response = await updateDispatchPatientInfo(requestData);

      if (response.isSuccess) {
        return response.data;
      }
    } catch (error) {
      console.error('저장 중 오류 발생', error);
      throw error;
    }
  },

  resetPatientInfo: () => {
    set({
      formData: initialFormData,
    });
  },

  preKtasAI: async () => {
    const {formData} = get()   // 환자 현재 정보 가져오기

    try {
      const requestData: PreKtasAIRequest = {
        patientAge: formData.patientAge,
        patientBloodSugar: formData.patientBloodSugar,
        patientDiastolicBldPress: formData.patientDiastolicBldPress,
        patientSystolicBldPress: formData.patientSystolicBldPress,
        patientPulseRate: formData.patientPulseRate,
        patientTemperature: formData.patientTemperature,
        patientSpo2: formData.patientSpo2,
        patientMental: formData.patientMental,
        patientSymptom: formData.patientSymptom
      }

      const response = await preKtasAI(requestData);
      if (response.patientPreKtas) {
        get().updateFormData({
          patientPreKtas: response.patientPreKtas
        });
      }
      return response;
    } catch (error) {
      console.error("ktas 예측 실패", error);
      throw error;
    }
  },

  sendProtectorMessage: async (transferId: number) => {
    const {formData} = get();
    if (typeof formData.patientId !== 'number') {
      throw new Error('유효한 환자 ID가 없습니다.');
    }

    try {
      const response = await sendProtectorMessage(formData.patientId, transferId);
      if (response.isSuccess) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

}));
