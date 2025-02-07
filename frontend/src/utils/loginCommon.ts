import { axiosInstance } from '@utils/axios.ts';
import { AxiosError } from 'axios';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';

// 공통 로그인 유틸리티
export interface CommonLoginParams {
  loginPath: string;
  formData: URLSearchParams;
}

export const commonLogin = async function (params: CommonLoginParams) {
  try {
    const response = await axiosInstance.post(params.loginPath, params.formData, {
      // axios에 지정 불가능(회원가입시엔 json 필요!)
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true, // 쿠키 전달
    });
    console.log('All headers:', response.headers);
    // 서버는 토큰을 access 키로 보냄.
    const accessToken = response.headers['access'];
    console.log('accessToken:', accessToken);

    if (!accessToken) {
      // 에러 객체 생성만 하고 던지지 않기
      const error = new Error(response?.data?.message ?? '로그인 실패');

      // 콘솔에 로깅
      console.error(error.message);

      // 상위로 전파하지 않고 내부에서 처리
      return Promise.reject(error);
    }

    // 토큰 설정 로직
    localStorage.setItem('token', accessToken); // 응답받은 토큰 저장, 상태 업데이트는 각 스토어에서

    // 요청할 때는 Authorization으로 요청해야함.
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; // 이후 요청 헤더 설정

    return accessToken;
  } catch (error: unknown) {
    // 에러 처리
    const axiosError = error as AxiosError;

    console.error('Login error details:', {
      error,
      response: axiosError.response,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    });
    throw axiosError; // 원래 에러 다시 던지기
  }
};

export const commonLogout = async (logoutPath: string) => {
  try {
    console.log('로그아웃 요청 전 설정:', {
      url: 'user/logout',
      headers: axiosInstance.defaults.headers,
      cookies: document.cookie,
    });

    if(useOpenViduStore.getState().session) {
      const store = useOpenViduStore.getState();
      await store.leaveSession();
      store.setSessionActive(false); // 세션 비활성화
    }

    await axiosInstance.post(logoutPath);
    console.log('로그아웃 요청 성공');

    // 토큰 제거  , 상태 업데이트는 스토어에서
    localStorage.removeItem('token');

    // axios 헤더에서 토큰 제거
    delete axiosInstance.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error('로그아웃 실패:', error);
    return Promise.reject(error); // throw 대신 Promise.reject 사용
  }
};
