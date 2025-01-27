import { create } from 'zustand';
import { AuthStore, UserType, AuthResponse } from '@types/auth/auth.types';
import { idAuthService } from '@features/auth/servies/idAuthService.ts';
import { emailAuthService } from '@features/auth/servies/emailAuthService.ts';

export const useAuthStore = create<AuthStore>((set) => ({
  // 초기상태
  token: localStorage.getItem('token'),
  userType: null,
  isAuthenticated: false,

  // 액션
  login: async (data: AuthResponse) => {
    try {
      let response;

      // 로그인 타입에 따른 다른 서비스 호출
      if (data.type === 'email') {
        response = await emailAuthService.login(data);
      } else {
        switch (data.userType) {
          case 'dispatch':
            response = await idAuthService.dispatchLogin(data);
            break;
          case 'hospital':
            response = await idAuthService.hospitalLogin(data);
            break;
          case 'control':
            response = await idAuthService.controlLogin(data);
            break;
          case 'admin':
            response = await idAuthService.adminLogin(data);
            break;
        }
      }
      if (response) {
        const { token, userType } = response.data;
        localStorage.setItem('token', token); // 응답받은 토큰 저장
        set({ token, userType, isAuthenticated: true }); // 상태 업데이트
      }
    } catch (error) {
      // 에러 처리
      throw error;
    }
  },
  // 로그아웃 시 토큰 제거 및 상태 초기화
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, userType: null, isAuthenticated: false });
  },

  mediInfo: {
    currentIllnesses: [],
    medications: [],
  },
  setCurrentIllnesses: (illnesses) =>
    set((state) => ({ mediInfo: { ...state.mediInfo, currentIllnesses: illnesses } })),
  setMedications: (medications) =>
    set((state) => ({ mediInfo: { ...state.mediInfo, medications } })),
}));
