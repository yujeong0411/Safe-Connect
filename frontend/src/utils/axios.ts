import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // 요청 제한 시간 5초
  headers: {
    'Content-Type': 'application/json', // JSON 형식으로 통신
  },
});

// 요청 인터셉터  (요청 보내기 전에 실행)
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // JWT 토큰 헤더에 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터  (응답 받은 후 실행)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리
    if (error.response?.status === 401) {
      // 인증 에러면
      localStorage.removeItem('token'); // 토큰 삭제

      // 현재 URL을 확인하여 적절한 로그인 페이지로 리다이렉트
      const currentPath = window.location.pathname;

      if (currentPath.includes('/dispatch')) {
        window.location.href = '/dispatch/login';
      } else if (currentPath.includes('/hospital')) {
        window.location.href = '/hospital/login';
      } else if (currentPath.includes('/control')) {
        window.location.href = '/control/login';
      } else if (currentPath.includes('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/user/login'; // 기본 유저 로그인
      }
    }
    return Promise.reject(error);
  }
);
