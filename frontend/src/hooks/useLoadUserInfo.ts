import { useAuthStore } from '@/store/user/authStore.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useState } from 'react';

// user인지 medi인지 구분하기
export const useLoadUserInfo = (type: 'user' | 'medi') => {
  const { fetchUserInfo, fetchMediInfo } = useAuthStore();
  const { setFormData } = useSignupStore();
  const [isLoading, setIsLoading] = useState(false);

  const loadUserInfo = async () => {
    try {
      setIsLoading(true);
      const data = // 데이터 조회
        type === 'user'
          ? await fetchUserInfo() // 유저
          : await fetchMediInfo(); // 의료
      setFormData(data); // 조회한 데이터 formData에 설정
      return data; // 데이터를 반환하도록 추가
    } catch (error) {
      alert(`${type === 'user' ? '회원' : '의료'}정보를 가져오지 못했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };
  return { loadUserInfo, isLoading };
};
