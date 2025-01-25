import { axiosInstance } from '@/utils/axios.ts';
import { EmailLoginRequest, AuthResponse } from '@types/auth/auth.types';

export const emailAuthService = {
  login: (data: EmailLoginRequest) => {
    return axiosInstance.post<AuthResponse>('/user/login', data);
  },
};
