import { axiosInstance } from '@utils/axios.ts';

export const fetchFireUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/fire/users'); // API 엔드포인트로 수정 필요
    return response.data;
  } catch (error) {
    console.error('Failed to fetch fire users:', error);
    throw error;
  }
};
