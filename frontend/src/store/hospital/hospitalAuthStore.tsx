import { create } from 'zustand';
import { HospitalLoginRequest, HospitalAuthStore } from '@/types/hospital/hospitalAuth.types.ts';
import { commonLogin, commonLogout } from '@utils/loginCommon.ts';
import {LOGIN_PATH} from "@/routes/LogoutPathRoutes.ts";

export const useHospitalAuthStore = create<HospitalAuthStore>((set) => ({
  token: sessionStorage.getItem('token'),
  isAuthenticated: !!sessionStorage.getItem('token'),
  userName:sessionStorage.getItem('username'),

  // 타입 변환 함수 추가
  login: async (data: HospitalLoginRequest) => {
    // 벡엔드에서 form-data 형식으로 받음.
    const formData = new URLSearchParams();
    formData.append('hospitalLoginId', data.hospitalLoginId);
    formData.append('hospitalPassword', data.hospitalPassword);
    // 로그인 공통 로직 사용
    const accessToken = await commonLogin({
      loginPath: '/hospital/login',
      formData,
    });

    // userName이 계속 필요하다면
    const userName = data.hospitalLoginId
    sessionStorage.setItem('userName', userName);

    // 상태 변경
    set({
      token: accessToken,
      isAuthenticated: true,
      userName, // 로그인한 사용자 아이디 저장
    });
  },

  // 로그아웃 시 토큰 제거 및 상태 초기화
  logout: async () => {
    await commonLogout('/hospital/logout');

    // 상태 변경
    set({
      token: null,
      isAuthenticated: false,
      userName: '',
    });
    window.location.href = LOGIN_PATH.HOSPITAL
  },
}));
