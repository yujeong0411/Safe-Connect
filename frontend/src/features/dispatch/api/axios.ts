// src/features/dispatch/api/axios.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30초로 늘림
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청 로깅
    return config;
  },
  (error) => {
    console.error('API 요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    // 성공 응답 로깅
    return response;
  },
  (error) => {
    // 자세한 에러 정보 로깅
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
    };
    console.error('API 요청 실패:', errorInfo);
    
    // 에러 객체에 상세 정보 추가
    error.details = errorInfo;
    return Promise.reject(error);
  }
);

export default axiosInstance;