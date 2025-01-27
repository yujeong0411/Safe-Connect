import IdLoginForm from '@/features/auth/components/IdLoginForm.tsx';
import LoginTemplate from '@components/templates/LoginTemplate.tsx';

const ControlLoginPage = () => {
  return (
    <div>
      <LoginTemplate>
        <IdLoginForm />
      </LoginTemplate>
    </div>
  );
};

export default ControlLoginPage;
