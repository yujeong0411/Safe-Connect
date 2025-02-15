import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL
  // : import.meta.env.MODE === 'production'
  //   ? import.meta.env.VITE_BASE_URL
    : '/api',
  timeout: 20000, // 요청 제한 시간 20초
  // headers 초기화 시 토큰이 없을 때 문제 발생
  headers: {
    Authorization: sessionStorage.getItem('token')
      ? `Bearer ${sessionStorage.getItem('token')}`
      : undefined,
  },
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
      withCredentials: config.withCredentials,
    });

    // 토큰이 있다면 헤더에 추가
    const token = sessionStorage.getItem('token');
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
    console.log('토큰 갱신 요청 에러 상세:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config,
    });
    const originalRequest = error.config;

    // 로그인 요청은 토큰 갱신 시도 제외
      if (originalRequest.url.includes('/login')) {
          return Promise.reject(error);
      }

    // 401에러이고 재시도 중이 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 에러 발생, 토큰 갱신 시도');
      originalRequest._retry = true;

      // 무한 루프 방지 조건 추가
      if (originalRequest.url === '/reissue') {
        console.error('토큰 갱신 실패: 리프레시 요청 반복됨.');
        return Promise.reject(error);
      }

      try {
          console.log('토큰 갱신 요청 시작');
          const response = await axiosInstance.post('/reissue', {}, {
              withCredentials: true
          });
          // 새 토큰 가져오기 (서버는 access로 내려줌)
        const newAccessToken = response.headers['access'];
        console.log('새로운 액세스 토큰:', newAccessToken);

        if (newAccessToken) {
          // 새토큰 저장
          sessionStorage.setItem('token', newAccessToken);

          // 원본 요청의 헤더 업데이트
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          // Axios 기본 헤더 업데이트
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

          // 원본 요청 재시도
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료되었거나 유효하지 않은 경우
        console.error('Token refresh failed:', refreshError);

        // 갱신 실패 시 로그인 페이지로 리다이렉트
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userName');

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
