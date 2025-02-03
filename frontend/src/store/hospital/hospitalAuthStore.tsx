import { create } from 'zustand';
import { HospitalLoginRequest, HospitalAuthStore } from '@/types/hospital/hospitalAuth.types.ts';
import { commonLogin, commonLogout } from '@utils/loginCommon.ts';

export const useHospitalAuthStore = create<HospitalAuthStore>((set) => ({
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  // 타입 변환 함수 추가
  login: async (data: HospitalLoginRequest) => {
    console.log("보내는 데이터 : ", data)

    // 벡엔드에서 form-data 형식으로 받음.
    const formData = new URLSearchParams();
    formData.append('hospitalLoginId', data.hospitalLoginId);
    formData.append('hospitalPassword', data.hospitalPassword);
    // 문자열로 변환
    console.log(formData.toString());
    // 로그인 공통 로직 사용
    const accessToken = await commonLogin({
      loginPath: '/hospital/login',
      formData,
    });

    // 상태 변경
    set({
      token: accessToken,
      isAuthenticated: true,
    });
  },

  // 로그아웃 시 토큰 제거 및 상태 초기화
  logout: async () => {
    await commonLogout('/hospital/logout');

    // 상태 변경
    set({
      token: null,
      isAuthenticated: false,
    });
  },
}));
