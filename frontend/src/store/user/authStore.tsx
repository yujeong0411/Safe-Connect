import { create } from 'zustand';
import { AuthStore, EmailLoginRequest } from '@types/user/auth.types.ts';
import { axiosInstance } from '@utils/axios.ts';
import { findEmail } from '@features/auth/servies/apiService.ts';

export const useAuthStore = create<AuthStore>((set) => ({
  // 초기상태
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'), // 토큰 존재 여부로 인증 상태 초기화\
  // setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  //
  // // localStorage 기반으로 로그인 상태 확인하는 함수
  // checkAuth: () => {
  //   const token = localStorage.getItem('token');
  //   set({ isAuthenticated: !!token }); // 토큰이 있으면 true, 없으면 false
  // },

  userEmail: '',

  // 로그인
  login: async (data: EmailLoginRequest) => {
    // backend에서 form-data 형식으로 받음.
    const formData = new URLSearchParams();
    formData.append('userEmail', data.userEmail);
    formData.append('userPassword', data.userPassword);
    // 문자열로 변환
    console.log(formData.toString());

    try {
      console.log('Login attempt with data:', formData);
      const response = await axiosInstance.post('/user/login', formData, {
        // axios에 지정 불가능(회원가입시엔 json 필요!)
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true, // 이 부분 추가
      });
      console.log('All headers:', response.headers); // 모든 헤더 확인
      console.log('access header:', response.headers['access']); // 소문자로도 확인
      const accessToken = response.headers['access'];
      console.log('accessToken:', accessToken);

      // 성공시에만 200 응답과 토큰을 주기때문에 또 true 확인할 필요는 없다.
      if (accessToken) {
        localStorage.setItem('token', accessToken); // 응답받은 토큰 저장
        set({ token: accessToken, isAuthenticated: true }); // 상태 업데이트

        console.log('token', accessToken);
        axiosInstance.defaults.headers.common['access'] = `Bearer ${accessToken}`; // 이후 요청 헤더 설정

        // 로그인 성공 후 바로 리턴하여 리다이렉트 방지
        return;
      } else {
        console.error('No authorization header found in response');
        throw new Error(response.data.message || '로그인 실패');
      }
    } catch (error) {
      // 에러 처리
      console.error('Login error details:', {
        error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 로그아웃 시 토큰 제거 및 상태 초기화
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
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
      console.log('정보 변경 확인:', response.data);
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
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error('의료 정보 조회 실패', error);
      throw error;
    }
  },

  // 의료 정보 수정
  updateMediInfo: async (updateData) => {
    try {
      const response = await axiosInstance.post('/user/medi', updateData);
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
      throw new Error(response.message);
    } catch (error) {
      console.error('이메일 찾기 실패:', error);
      throw error;
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
}));
