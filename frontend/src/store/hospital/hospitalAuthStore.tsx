import { create } from 'zustand';
import { axiosInstance } from '@utils/axios.ts';
import { HospitalLoginRequest, HospitalAuthStore } from '@types/hospital/hospitalAuth.types.ts';

export const useHospitalAuthStore = create<HospitalAuthStore>((set) => ({
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  // 타입 변환 함수 추가
  login: async (credentials: Record<string, string>) => {
    const data: HospitalLoginRequest = {
      hospitalLoginId: credentials['hospitalLoginId'],
      hospitalPassword: credentials['hospitalPassword'],
    };
    try {
      const response = await axiosInstance.post('/hospital/login', data);
      const authHeader = response.headers['authorization'];
      if (authHeader) {
        const accessToken = authHeader.replace('Bearer ', '');
        localStorage.setItem('accessToken', accessToken);
        set({ token: accessToken, isAuthenticated: true });
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      console.error('login error', error);
      throw error;
    }
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('accessToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
    set({ token: null, isAuthenticated: false });
  },
}));
