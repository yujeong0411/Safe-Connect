import { useAuthStore } from '@/store/user/authStore.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useState } from 'react';

interface MediItem {
  mediId: number;
  mediName: string;
}

interface MediCategory {
  categoryName: string;
  mediList: MediItem[];
}

// user인지 medi인지 구분하기
export const useLoadUserInfo = (type: 'user' | 'medi') => {
  const { fetchUserInfo, fetchMediInfo } = useAuthStore();
  const { formData, setFormData } = useSignupStore();
  const [isLoading, setIsLoading] = useState(false);

  const loadUserInfo = async () => {
    try {
      setIsLoading(true);

      // 유저 정보 가져오기
      if (type === 'user') {
        const userData = await fetchUserInfo();
        setFormData(userData);
        return userData;
      } else {
        // 의료정보 가져오기
        const mediData: MediCategory[] = await fetchMediInfo();
        // mediData가 null이면 빈 배열로 초기화
        if (!mediData) {
          setFormData({
            ...formData,
            diseaseId: [],
            medicationId: [],
          });
          return [];
        }

        // 의료 데이터 형식에 맞게 변환 (ID 추출)
        const diseaseIds =
          mediData
            .find((category) => category.categoryName === '기저질환')
            ?.mediList.map((item) => {
              // 각 항목의 상세 정보 확인
              return item.mediId;
            }) || [];

        const medicationIds =
          mediData
            .find((category) => category.categoryName === '복용약물')
            ?.mediList.map((item) => {
              // 각 항목의 상세 정보 확인
              return item.mediId;
            }) || [];

        // form 업데이트
        setFormData({
          ...formData,
          diseaseId: diseaseIds,
          medicationId: medicationIds,
        });

        return mediData;
      }
    } catch (error) {
      alert(`${type === 'user' ? '회원' : '의료'}정보를 가져오지 못했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { loadUserInfo, isLoading };
};
