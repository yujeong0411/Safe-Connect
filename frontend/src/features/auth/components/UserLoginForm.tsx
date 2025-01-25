import React from 'react';
import Button from '@components/atoms/Button/Button.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import { LoginFormProps } from '@types/common/Login.types.ts';

function UserLoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(email, password);
  };
  return (
    <div
      className="w-[626px] h-[496px] relative overflow-hidden rounded-[20px] bg-[#f8f8f8]/80"
      style={{ boxShadow: '0px 20px 30px 0 rgba(0,0,0,0.1)' }}
    >
      <form onSubmit={handleSubmit}>
        <div className="w-[496px] h-[425px] absolute left-[65px] top-[39px]">
          <h1 className="absolute left-0 top-[-0.75px] text-[40px] font-medium text-left text-[#112031]">
            로그인
          </h1>

          <div className="flex flex-col justify-start items-start w-[487px] absolute left-0 top-[91px] gap-[8px]">
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
}

export default UserLoginForm;
