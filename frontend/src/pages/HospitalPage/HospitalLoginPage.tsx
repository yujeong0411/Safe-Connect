import IdLoginForm from '@/features/auth/components/IdLoginForm.tsx';
import LoginTemplate from '@features/auth/components/LoginTemplate.tsx';
import { useHospitalAuthStore } from '@/store/hospital/hospitalAuthStore.tsx';
import { useNavigate } from 'react-router-dom';

const HospitalLoginPage = () => {
  const navigate = useNavigate();
  const login = useHospitalAuthStore();
  return (
    <div>
      <LoginTemplate>
        <IdLoginForm
          fields={{
            UserId: 'hospitalLoginId',
            UserPassword: 'hospitalPassword',
          }}
          loginStore={login}
          onSuccess={() => navigate('/hospital/request')}
        />
      </LoginTemplate>
    </div>
  );
};
export default HospitalLoginPage;
