import { create } from 'zustand';
import { AdminAuthStore, AdminLoginRequest } from '@/types/admin/adminAuth.types.ts';
import { commonLogin, commonLogout } from '@utils/loginCommon.ts';

export const useAdminAuthStore = create<AdminAuthStore>((set) => ({
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  // 타입 변환 함수 추가
  login: async (data: AdminLoginRequest) => {
    // 벡엔드에서 form-data 형식으로 받음.
    const formData = new URLSearchParams();
    formData.append('adminLoginId', data.adminLoginId);
    formData.append('adminPassword', data.adminPassword);
    // 문자열로 변환
    console.log(formData.toString());
    // 로그인 공통 로직 사용
    const accessToken = await commonLogin({
      loginPath: '/admin/login',
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
    await commonLogout('/admin/logout');

    // 상태 변경
    set({
      token: null,
      isAuthenticated: false,
    });
  },
}));
