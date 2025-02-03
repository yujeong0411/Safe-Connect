import IdLoginForm from '@/features/auth/components/IdLoginForm.tsx';
import LoginTemplate from '@features/auth/components/LoginTemplate.tsx';
import { useNavigate } from 'react-router-dom';
import { useControlAuthStore } from '@/store/control/controlAuthStore.tsx';

const ControlLoginPage = () => {
  const navigate = useNavigate();
  const login = useControlAuthStore();

  return (
    <div>
      <LoginTemplate>
        <IdLoginForm
          fields={{
            UserId: 'fireStaffLoginId',
            UserPassword: 'fireStaffPassword',
          }}
          loginStore={login}
          onSuccess={() => navigate('/control/main')}
        />
      </LoginTemplate>
    </div>
  );
};

export default ControlLoginPage;
