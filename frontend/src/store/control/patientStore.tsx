import { create } from 'zustand';
import { PatientInfo, PatientStore, FormData, CurrentCall } from '@/types/common/Patient.types.ts';
import {controlService, patientService, protectorService} from '@features/control/services/controlApiService.ts';
import {useOpenViduStore} from "@/store/openvidu/OpenViduStore.tsx";
// callId 삭제 : openvidu에서만 관리 -> 영상통화 종료 시 자동으로 초기화됨.
const initialFormData: FormData = {
  userName: '',
  userGender: '',
  userAge: '',
  userPhone: '',
  userProtectorPhone: '',
  diseases: '',
  medications: '',
  callSummary: '',
  addSummary:'',
  symptom: '',
  userId: 0
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patientInfo: null,
  currentCall: null, // 현재 처리 중인 신고 정보
  formData: initialFormData,
  reportContent:'',


  // reportContent 업데이트
  updateReportContent: (content: string) => {
    set(state => ({
      ...state,
      reportContent: content,
    }))
  },

  // 폼 업데이트
  updateFormData: (data:Partial<FormData>) => {
    set(state => ({
      formData: {
        ...state.formData,
        ...data
      }
    }))
  },

  // 현재 신고
  setCurrentCall: (info:CurrentCall ) => {
    set({ currentCall: info });
  },

  // 전화번호로 회원 검색
  searchByPhone: async (callerPhone: string) => {
    try {
      const response = await patientService.searchByPhone(callerPhone);
      console.log('전화번호 조회 응답', response);
      if (response.isSuccess) {
        const patientInfo = response.data as PatientInfo;
        set({
          patientInfo,
          formData: {
            ...get().formData,
            userName: patientInfo.userName || '',
            userGender: patientInfo.userGender || '',
            userAge: patientInfo.userAge?.toString() || '',
            userPhone: patientInfo.userPhone || '',
            userProtectorPhone: patientInfo.userProtectorPhone || '',
            diseases: patientInfo.mediInfo
                ?.find(m => m.categoryName === '기저질환')
                ?.mediList.map(m => m.mediName)
                .join(',') || '',
            medications: patientInfo.mediInfo
                ?.find(m => m.categoryName === '복용약물')
                ?.mediList.map(m => m.mediName)
                .join(',') || '',
            userId: patientInfo.userId
          }
        })
        return response;
      }
    } catch (error) {
      console.error("전화번호 조회 실패", error);
    }
  },

  // 신고 내용 저장(수정)
  savePatientInfo: async () => {
    try {
      const {  formData } = get();  // 내부 상태 가져오기
      const {callId} = useOpenViduStore.getState()

      // callId 유효성 체크 추가
      if (!callId) {
        console.error('영상통화 정보가 없습니다.');
        return;
      }

      // callSummary와 addSummary 합치기
      const combinedSummary = formData.addSummary
          ? `${formData.callSummary}\n\n${formData.addSummary}`
          : formData.callSummary;

      // 현재 선택된 회원 ID와 신고 ID 추가
      const callInfo = {
        userId: formData.userId || null,  // 검색된 회원의 ID, 회원이 아니라면 null
        symptom: formData.symptom,
        callSummary: combinedSummary,   // 합쳐진 summary 저장
      };

      // api 호출 시 callId 필요
      const response = await patientService.savePatientInfo({
        ...callInfo,
        callId
      });

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

  resetPatientInfo: () => {
    set({
      patientInfo: null,
      currentCall: null,
      formData: initialFormData  // formData 초기화 추가
    });
  },

  // 보호자 문자 전송
  sendProtectorMessage: async (callerPhone: string) => {
    try {
      const response = await protectorService.sendProtectorMessage(callerPhone);
      return response.isSuccess;
    } catch (error: any) {
      console.error('보호자 문자 전송 실패', error);
      throw error;
    }
  },

  // 신고내용 요약
  fetchCallSummary: async (callId:number, audioBlob: Blob) => {
    try {
      const response= await controlService.callSummary(Number(callId), audioBlob);
      if (response) {
        set(state => ({
          ...state,
          formData: {
            ...state.formData,
            callSummary: response.data.callSummary,
            addSummary: '', // 새로운 AI요약본 받아올때 최소화
          }
        }))
      }
    } catch (error) {
      console.error("신고내용 요약 실패", error)
    }
  }
}))
