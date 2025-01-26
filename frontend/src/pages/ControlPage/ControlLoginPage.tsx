import React from 'react';
import IdLoginForm from '@/features/auth/components/IdLoginForm.tsx';
import LoginTemplate from '@components/templates/LoginTemplate.tsx';

const LoginPage = () => {
  return (
    <div>
      <LoginTemplate>
        <IdLoginForm />
      </LoginTemplate>
    </div>
  );
};

export default LoginPage;
