import { create } from 'zustand';
import {
  DispatchPatientStore,
  DispatchFormData,
  DispatchSavePatientRequest,
  PreKtasAIRequest,
} from '@/types/common/Patient.types.ts';
import {
  updateDispatchPatientInfo,
  preKtasAI,
  sendProtectorMessage,
  completeDispatch,
  completeTransfer,
} from '@features/dispatch/sevices/dispatchServiece.ts';


const initialFormData: Omit<DispatchFormData, 'patientId' | 'dispatchId'> = {
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
  patientIsUser: false,
  callerLocation: undefined,
};

export const useDispatchPatientStore = create<DispatchPatientStore>((set, get) => ({
  formData: initialFormData as DispatchFormData,
  currentTransfer: null,   // 현재 이송
  dispatchStatus: 'ongoing' as const, // 초기 상태 출동 중

  // SSE로 받은 환자 정보 formData에 설정 (출동 시작)
  setPatientFromSSE: (data) => {
    set(() => ({
      formData: {
        ...initialFormData,
        patientId: data.patient.patientId,
        dispatchId:data.dispatchId,
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
        patientPhone: data.patient.patientIsUser
          ? data.user?.userPhone || ''
          : data.call.callerPhone || '',
        patientProtectorPhone: data.user?.protectorPhone || '',
        diseases:
          data.mediInfo
            ?.find((m) => m.categoryName === '기저질환')
            ?.mediList.map((m) => m.mediName)
            .join(',') || '',
        medications:
          data.mediInfo
            ?.find((m) => m.categoryName === '복용약물')
            ?.mediList.map((m) => m.mediName)
            .join(',') || '',
        callSummary: data.call.callSummary,
        patientIsUser: data.patient.patientIsUser,
        callerLocation: data.callerLocation,
      },
      dispatchStatus: 'ongoing',    // 출동 지령 받았을 때 출동 중
    }));
  },

  // 정보가 없을 경우 구급대원이 자유롭게 입력 가능
  updateFormData: (data) => {
    const { dispatchStatus } = get();
    // 출동 중이 아니라면
    if (dispatchStatus !== 'ongoing') {
      throw new Error('이미 종료된 출동은 수정할 수 없습니다.');
    }
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
        patientIsUser: formData.patientIsUser,
      };
      const response = await updateDispatchPatientInfo(requestData);

      if (response.isSuccess) {
        return response.data;
      }
    } catch (error) {
      console.error('저장 중 오류 발생', error);
      throw error;
    }
  },

  // 이송 정보 설정 (병원 수락 시)
  setTransferInfo: (info) => {
    const { dispatchStatus } = get();
    // 출동 중이 아니라면 
    if (dispatchStatus !== 'ongoing') {
      throw new Error('이미 종료된 출동입니다.');
    }
    set({ currentTransfer: info });   // transferId 포함
  },

  // 이송 정보 업데이트   -> 필요없으면 지우기
  updateTransferInfo: (info) => {
    set((state) => ({
      currentTransfer: state.currentTransfer ? { ...state.currentTransfer, ...info } : null,
    }));
  },

  // 이송 종료
  completeTransfer: async (transferId: number) => {
    const { dispatchStatus, currentTransfer } = get();

    // 출동 중이 아니거나 현재 이송이 없다면
    if (dispatchStatus !== 'ongoing' || !currentTransfer) {
      throw new Error('이송을 종료할 수 없습니다.');
    }

    try {
      const response = await completeTransfer(transferId); // API 호출
      set({
        dispatchStatus: 'transferred',    // 이송 완료 상태 변경
        currentTransfer: {
          ...currentTransfer,
          completedAt: new Date().toISOString(),
        },
      });
      return response
    } catch (error) {
      throw error;
    }
  },

  // 출동 종료 (이송하지 않는 경우)  dispatchId 필요!!
  completeDispatch: async () => {
    const { dispatchStatus, formData } = get();

    if (dispatchStatus !== 'ongoing') {
      throw new Error('이미 종료된 출동입니다.');
    }

    if (!formData.patientId) {
      throw new Error('환자 정보가 없습니다.');
    }

    try {
      await completeDispatch(formData.dispatchId); // API 호출
      set({
        dispatchStatus: 'completed',    // 출동 완료 상태 변경
        currentTransfer: null,
      });
    } catch (error) {
      throw error;
    }
  },

  resetPatientInfo: () => {
    set({
      formData: initialFormData as DispatchFormData,  // 모든 데이터 초기화
      currentTransfer: null,
      dispatchStatus: 'ongoing',  // 다시 초기화
    });
  },

  preKtasAI: async () => {
    const { formData } = get(); // 환자 현재 정보 가져오기

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
        patientSymptom: formData.patientSymptom,
      };

      const response = await preKtasAI(requestData);
      if (response.patientPreKtas) {
        get().updateFormData({
          patientPreKtas: response.patientPreKtas,
        });
      }
      return response;
    } catch (error) {
      console.error('ktas 예측 실패', error);
      throw error;
    }
  },

  // 보호자 메세지 전송
  sendProtectorMessage: async () => {
    const { formData, dispatchStatus, currentTransfer } = get();

    if (dispatchStatus !== 'transferred') {
      throw new Error('이송이 완료되지 않았습니다.');
    }

    if (!formData.patientId || !formData.patientIsUser) {
      throw new Error('보호자 알림을 전송할 수 없는 환자입니다.');
    }

    if (!currentTransfer?.transferId) {
      throw new Error('이송 정보가 없습니다.');
    }

    try {
      const response = await sendProtectorMessage(formData.patientId, currentTransfer.transferId);
      if (response.isSuccess) {
        return response;
      }
    } catch (error) {
      throw error;
    }
  },
}));
