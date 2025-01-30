import IdLoginForm from '@/features/auth/components/IdLoginForm.tsx';
import LoginTemplate from '@features/auth/components/LoginTemplate.tsx';
import { useFireAuthStore } from '@/store/common/fireAuthStore.tsx';
import { useNavigate } from 'react-router-dom';

const ControlLoginPage = () => {
  const navigate = useNavigate();
  const login = useFireAuthStore();

  return (
    <div>
      <LoginTemplate>
        <IdLoginForm
          fields={{
            UserId: 'controlId',
            UserPassword: 'controlPassword',
          }}
          loginStore={login}
          onSuccess={() => navigate('/control/main')}
        />
      </LoginTemplate>
    </div>
  );
};

export default ControlLoginPage;
