import { useNavigate } from 'react-router-dom';
import { useDispatchAuthStore } from '@/store/dispatch/dispatchAuthStore.tsx';
import LoginTemplate from '@features/auth/components/LoginTemplate.tsx';
import IdLoginForm from '@features/auth/components/IdLoginForm.tsx';

const DispatchLoginPage = () => {
  const navigate = useNavigate();
  const login = useDispatchAuthStore();

  return (
    <div>
      <LoginTemplate>
        <IdLoginForm
          fields={{
            UserId: 'fireStaffLoginId',
            UserPassword: 'fireStaffPassword',
          }}
          loginStore={login}
          onSuccess={() => navigate('/dispatch/main')}
        />
      </LoginTemplate>
    </div>
  );
};

export default DispatchLoginPage;
