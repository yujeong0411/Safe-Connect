import { create } from 'zustand';
import { axiosInstance } from '@utils/axios.ts';
import { FireAuthStore, FireLoginRequest } from '@/types/common/fireAuth.types.ts';

export const useFireAuthStore = create<FireAuthStore>((set) => ({
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  login: async (credentials: Record<string, string>) => {
    const data: FireLoginRequest = {
      fireStaffLogInId: credentials['fireStaffLogInId'],
      fireStaffPassword: credentials['fireStaffPassword'],
    };
    try {
      const response = await axiosInstance.post('/control/login', data);
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
