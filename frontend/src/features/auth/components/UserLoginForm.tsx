import React, { useState } from 'react';
import Button from '@components/atoms/Button/Button.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';

const UserLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  //const { formData, setFormData } = useSignupStore();
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // 디버깅 로그
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login({
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
      });
      // 로그인 성공 시 폼 초기화
      setFormData({
        userEmail: '',
        userPassword: '',
      });
      // 로그인 성공 시 메인페이지 이동
      navigate('/user/main');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (name: 'userEmail' | 'userPassword') => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: event.target.value,
      }));
    };

  const handleFindEmail = () => {
    navigate('/user/findemail');
  };

  const handleFindPassword = () => {
    navigate('/user/findpassword');
  };

  // 에러 메세지 매핑
  const getErrorMessage = (error: any): string => {
    if(error.response?.status === 401) {
      return '아이디 또는 비밀번호가 일치하지 않습니다.'
    }
    if (error.response?.status === 404) {
      return '등록되지 않은 사용자입니다.';
    }
    if (error.response?.status === 500) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
    return '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  };


  return (
    <div
      className="
      w-full
      sm:w-[430px]
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
            <div className="flex justify-between w-full">
              <label>이메일</label>
              <span
                onClick={handleFindEmail}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                이메일 찾기
              </span>
            </div>
            <Input
              id="email"
              type="email"
              value={formData.userEmail}
              onChange={handleChange('userEmail')}
              width="full"
              variant="blue"
              isRequired // 필수 필드
            />

            <div className="flex justify-between w-full mt-3">
              <label>비밀번호</label>
              <span
                onClick={handleFindPassword}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                비밀번호 찾기
              </span>
            </div>
            <Input
              id="password"
              type="password"
              value={formData.userPassword}
              onChange={handleChange('userPassword')}
              variant="blue"
              width="full"
              isRequired
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex flex-col w-full mt-5 ">
              <Button type="submit" variant="blue" width="full" className="mb-3">
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
              <Link to="/user/signup">
                <Button variant="gray" width="full">
                  회원가입
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserLoginForm;
