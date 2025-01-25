import { axiosInstance } from '@utils/axios';
import { IdLoginRequest, AuthResponse } from '@types/auth/auth.types';

// data: IdLoginRequest - 요청 데이터의 타입을 지정
// <AuthResponse> - API 응답 데이터의 타입을 지정
export const idAuthService = {
  dispatchLogin: (data: IdLoginRequest) => {
    return axiosInstance.post<AuthResponse>('/dispatch/login', data);
  },
  hospitalLogin: (data: IdLoginRequest) => {
    return axiosInstance.post<AuthResponse>('/hospital/login', data);
  },
  controlLogin: (data: IdLoginRequest) => {
    return axiosInstance.post<AuthResponse>('/control/login', data);
  },
  adminLogin: (data: IdLoginRequest) => {
    return axiosInstance.post<AuthResponse>('/admin/login', data);
  },
};
