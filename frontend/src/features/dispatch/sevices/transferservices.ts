// src/features/dispatch/services/transferService.ts
import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true,
});

interface TransferRequestResponse {
  success: boolean;
  message: string;
}

export const transferService = {
  requestTransfer: async (hospitalIds: string[]) => {
    try {
      const response = await axiosInstance.post<TransferRequestResponse>(
        '/dispatch/transfer/request',
        { hospitalIds }
      );
      return response.data;
    } catch (error) {
      console.error('이송 요청 실패', error);
      throw error;
    }
  },
};