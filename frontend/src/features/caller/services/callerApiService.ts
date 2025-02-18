
import { axiosInstance } from '@utils/axios.ts';
import { AedResponse } from '@/types/common/aed.types.ts';


export const callerService= {
  // aed 검색
  searchAed: async (lat: number,lng : number): Promise<AedResponse> => {
    try {
      const response = await axiosInstance.get<AedResponse>('/user/nearby_aed', {params:{
        lat : lat,
        lon : lng}
      });
      return response.data;
    } catch (error: any) {
      // 구체적인 에러 처리
      console.error('searchByPhone 에러:', error);
      if (error.response) {
        // 서버에서 반환한 에러 메시지 그대로 throw
        throw new Error(error.response.data.message || '환자 정보 조회 중 오류 발생');
      }
      throw error;
    }
  },
}