import UserLoginForm from '@/features/auth/components/UserLoginForm.tsx';
import LoginTemplate from '@features/auth/components/LoginTemplate.tsx';

const LoginPage = () => {
  return (
    <div>
      <LoginTemplate>
        <UserLoginForm />
      </LoginTemplate>
    </div>
  );
};

export default LoginPage;
