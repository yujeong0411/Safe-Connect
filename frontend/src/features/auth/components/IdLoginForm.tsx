import React, { useState } from 'react';
import Button from '@components/atoms/Button/Button.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import { useAuthStore } from '@/store/user/authStore.tsx';

// Id를 이용하는 4명의 유저 공유
export interface IdLoginFormProps {
  fields: {
    // 보낼 필드명
    UserId: string;
    UserPassword: string;
  };
  loginStore: {
    // 각 유저별 스토어와 로그인 함수
    login: (data: any) => Promise<void>;
  };
  onSuccess?: () => void; // 로그인 성공 시 콜백(페이지 이동)
}

// FormData 타입 정의 추가
// 타입스크립트가 동적 키를 사용할 때 타입을 추론하는데 어려움
type FormDataType = {
  [K in keyof IdLoginFormProps['fields']]: string;
};

const IdLoginForm = ({ fields, loginStore, onSuccess }: IdLoginFormProps) => {
  const [formData, setFormData] = useState<FormDataType>({
    UserId: '',
    UserPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [_isLoading, setIsLoading] = useState<boolean>(false);

  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log('1. handleSubmit 시작'); // 디버깅 로그
    event.preventDefault();
    console.log('2. preventDefault 실행 후');

    setIsLoading(true);
    setError(null);

    try {
      console.log('3. login 호출 전');
      // 타입 안전성을 높이기 위해 직접 키 사용
      await loginStore.login({
        [fields.UserId]: formData.UserId,
        [fields.UserPassword]: formData.UserPassword,
      });
      console.log('4. login 완료');


      // 로그인 성공 시 폼 초기화
      setFormData({
        UserId: '',
        UserPassword: '',
      });
      setAuthenticated(true);

      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: event.target.value,
    }));
  };

  return (
    <div
      className="
      w-full
      sm:w-[450px]
      md:w-[626px]
      min-h-[400px]
      relative
      overflow-hidden
      rounded-[20px]
      bg-[#f8f8f8]/80
      shadow-lg"
      style={{ boxShadow: '0px 20px 30px 0 rgba(0,0,0,0.1)' }}
    >
      <form onSubmit={handleSubmit} className="p-4 md:p-0">
        <div
          className="
          w-full
          px-6             // 모바일에서 좌우 패딩
          md:px-[65px]     // 중간 화면에서 원래 패딩
          py-8            // 모바일에서 상하 패딩
          md:py-[39px]    // 중간 화면에서 원래 패딩
          "
        >
          <h1
            className="
            text-3xl
            md:text-[40px]
            font-medium
            text-[#112031]
            mb-8
            "
          >
            로그인
          </h1>

          <div
            className="
            flex flex-col
            gap-[8px]
            w-full
            "
          >
            <Input
              label="아이디"
              value={formData.UserId}
              type="string"
              onChange={handleChange('UserId')}
              width="full"
              variant="blue"
              isRequired // 필수 필드
            />

            <Input
              label="비밀번호"
              id="password"
              type="password"
              value={formData.UserPassword}
              onChange={handleChange('UserPassword')}
              variant="blue"
              width="full"
              isRequired
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="felx flex-col w-full mt-10 ">
              <Button type="submit" variant="blue" width="full" size="md" className="mb-3">
                로그인
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IdLoginForm;
