import { create } from 'zustand';
import { AuthStore, EmailLoginRequest } from '@/types/user/auth.types.ts';
import { axiosInstance } from '@utils/axios.ts';
import { findEmail } from '@features/auth/servies/apiService.ts';
import { commonLogin, commonLogout } from '@utils/loginCommon.ts';
import {LOGIN_PATH} from "@/routes/LogoutPathRoutes.ts";
import {AxiosError} from "axios";

export const useAuthStore = create<AuthStore>((set) => ({
  // 초기상태
  token: sessionStorage.getItem('token'),
  isAuthenticated: !!sessionStorage.getItem('token'), // 토큰 존재 여부로 인증 상태 초기화
  userEmail: '',

  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  // 로그인
  login: async (data: EmailLoginRequest) => {
    // 벡엔드에서 form-data 형식으로 받음.
    const formData = new URLSearchParams();
    formData.append('userEmail', data.userEmail);
    formData.append('userPassword', data.userPassword);

    // 로그인 공통 로직 사용
    const accessToken = await commonLogin({
      loginPath: '/user/login',
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
    await commonLogout('/user/logout');

    // 상태 변경
    set({
      token: null,
      isAuthenticated: false,
    });
    window.location.href = LOGIN_PATH.USER
  },

  // 회원 정보 조회
  fetchUserInfo: async () => {
    try {
      const response = await axiosInstance.get('/user');
      return response.data.data;
    } catch (error) {
      console.error('회원 정보 조회 실패', error);
      throw error;
    }
  },

  // 회원 정보 수정
  updateUserInfo: async (updateData) => {
    try {
      const response = await axiosInstance.put('/user', updateData);
      return response.data.data;
    } catch (error) {
      console.error('회원 정보 수정 실패', error);
      throw error;
    }
  },

  // 의료정보 조회
  fetchMediInfo: async () => {
    try {
      const response = await axiosInstance.get('/user/medi');
      return response.data.data;
    } catch (error) {
      // 500에러면서 의료정보가 없는 경우
      if (error instanceof AxiosError &&
          error.response?.status === 500 &&
          error.response?.data?.message === "User medi detail not found") {
        // 의료정보가 없는 경우 null이나 빈 객체 반환
        return null; // 또는 return {};
      }

      //  기타 에러
      console.error('의료 정보 조회 실패', error);
      throw error;
    }
  },

  // 의료 정보 저장
  saveMediInfo: async (updateData) => {
    try {
      const response = await axiosInstance.post('/user/medi', updateData);
      return response.data.data;
    } catch (error) {
      console.error('의료정보 저장 실패', error);
      throw error;
    }
  },

  // 의료 정보 수정 및 삭제
  updateMediInfo: async (updateData) => {
    try {
      const response = await axiosInstance.put('/user/medi', updateData);
      return response.data.data;
    } catch (error) {
      console.error('의료정보 수정 실패', error);
      throw error;
    }
  },

  // 새 비밀번호 변경
  updatePassword: async (updateData) => {
    try {
      const response = await axiosInstance.put('/user/password/change', updateData);
      return response.data.data;
    } catch (error) {
      console.error('비밀번호 변경 실패', error);
      throw error;
    }
  },

  // 이메일 찾기
  findEmail: async (userName: string, userPhone: string) => {
    try {
      const response = await findEmail(userName, userPhone); // API 서비스 호출

      if (response.isSuccess) {
        set({ userEmail: response.userEmail }); // 스토어의 상태 업데이트
        return response.userEmail;
      }
      // 에러 객체 생성 후 Promise.reject로 처리
      return Promise.reject(new Error(response.message));
    } catch (error) {
      console.error('이메일 찾기 실패:', error);
      //throw error;
      return Promise.reject(error);
    }
  },

  // 임시 비밀번호 발급
  findPassword: async (userEmail: string) => {
    try {
      const response = await axiosInstance.put('/user/find/password', { userEmail });
      return response.data.isSuccess; // true, false만 반환
    } catch (error) {
      console.error('임시 비밀번호 발급 실패', error);
      throw error;
    }
  },

  // 회원탈퇴
}));
