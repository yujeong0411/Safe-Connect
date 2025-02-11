import Input from '@components/atoms/Input/Input.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import {useEffect} from "react";
import {formatPhoneNumber} from "@features/auth/servies/signupService.ts";

const UserFindEmailForm = () => {
  const { formData, setFormData } = useSignupStore();
  // 컴포넌트가 마운트 될때 초기화
    useEffect(() => {
        setFormData({userEmail:'', userPhone:''});
    }, [])

// 공백 제거 및 하이픈 포맷팅 핸들러 함수
    const handleChange = (field: 'userName' | 'userPhone') => (e: React.ChangeEvent<HTMLInputElement>) => {
        let cleanedValue = e.target.value.replace(/\s/g, ''); // 모든 공백 제거

        if (field === 'userPhone') {
            cleanedValue = formatPhoneNumber(cleanedValue);  // 하이픈 삽입
        }

        setFormData({ [field]: cleanedValue });
    };


  return (
    <div className="w-full flex flex-col justify-center items-center space-y-5 p-10">
      <Input
        label="이름"
        value={formData.userName}
        onChange={handleChange('userName')}
        isRequired
      />
      <Input
        label="전화번호"
        value={formData.userPhone}
        onChange={handleChange('userPhone')}
        isRequired
      />
    </div>
  );
};

export default UserFindEmailForm;
