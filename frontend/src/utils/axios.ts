import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 5000, // 요청 제한 시간 5초
  withCredentials: true, // 쿠키를 포함시키기 위해 설정한다
});

// 요청 인터셉터  (요청 보내기 전에 실행)
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request Config Details:', {
      url: config.url,
      method: config.method,
      data: config.data ? JSON.stringify(config.data) : null, // JSON 문자열로 변환
      headers: config.headers,
    });

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
  async (error) => {
    const originalRequest = error.config;

    // 401에러이고 재시도 중이 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 무한 루프 방지 조건 추가
      if (originalRequest.url === '/reissue') {
        console.error('토큰 갱신 실패: 리프레시 요청 반복됨.');
        return Promise.reject(error);
      }

      try {
        // 토큰 갱신 요청
        const response = await axiosInstance.post('/reissue');

        // 새 토큰 가져오기
        const newToken = response.headers['access']?.replace('Bearer ', '');
        if (newToken) {
          // 새토큰 저장
          localStorage.setItem('token', newToken);
          axiosInstance.defaults.headers.common['access'] = `Bearer ${newToken}`;
          originalRequest.headers['access'] = `Bearer ${newToken}`;

          // 원본 요청 재시도
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료되었거나 유효하지 않은 경우
        console.error('Token refresh failed:', refreshError);
        // 갱신 실패 시 로그인 페이지로 리다이렉트
        localStorage.removeItem('token');
        // window.location.href = '/user/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
