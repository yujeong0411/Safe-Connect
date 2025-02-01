import { useAuthStore } from '@/store/user/authStore.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useState } from 'react';

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
        const mediData = await fetchMediInfo();
        console.log('서버에서 받은 의료 데이터:', mediData);

        // 의료 데이터 형식에 맞게 변환 (ID 추출)
        const diseaseIds =
          mediData
            .find((category) => category.categoryName === '기저질환')
            ?.mediList.map((item) => {
              console.log('기저질환 항목:', item); // 각 항목의 상세 정보 확인
              return item.mediId;
            }) || [];

        const medicationIds =
          mediData
            .find((category) => category.categoryName === '복용약물')
            ?.mediList.map((item) => {
              console.log('복용약물 항목:', item); // 각 항목의 상세 정보 확인
              return item.mediId;
            }) || [];

        console.log('변환된 ID들:', { diseaseIds, medicationIds });

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
