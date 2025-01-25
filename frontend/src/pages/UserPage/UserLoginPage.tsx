import React from 'react';
import UserLoginForm from '@/features/auth/components/UserLoginForm.tsx';
import LoginTemplate from '@components/templates/LoginTemplate.tsx';

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
