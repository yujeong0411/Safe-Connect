import { useState } from 'react';
import Button from '@components/atoms/Button/Button.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import { LoginFormProps } from '@features/auth/types/UserLoginFrom.tyeps.ts';

const IdLoginForm = ({ onSubmit }: LoginFormProps) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await onSubmit(id, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
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
              value={id}
              type="string"
              onChange={(event) => setId(event.target.value)}
              width="full"
              variant="blue"
              isRequired // 필수 필드
            />

            <Input
              label="비밀번호"
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              variant="blue"
              width="full"
              isRequired
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="felx flex-col w-full mt-5 ">
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
