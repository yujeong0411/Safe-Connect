import React from 'react';
import Button from '@components/atoms/Button/Button.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import { LoginFormProps } from '@types/common/Login.types.ts';

const UserLoginForm = ({ onSubmit }: LoginFormProps) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(email, password);
  };
  return (
    <div
      className="
      w-full
      sm:w-[450px]
      md:w-[626px]
      min-h-[500px]
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
              <span className="text-blue-500">이메일 찾기</span>
            </div>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              width="full"
              variant="blue"
              isRequired // 필수 필드
            />

            <div className="flex justify-between w-full mt-3">
              <label>비밀번호</label>
              <span className="text-blue-500">비밀번호 찾기</span>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              variant="blue"
              width="full"
              isRequired
            />
            <div className="felx flex-col w-full mt-5 ">
              <Button type="submit" variant="blue" width="full" className="mb-3">
                로그인
              </Button>
              <Button variant="gray" width="full">
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserLoginForm;
