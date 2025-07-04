import IdLoginForm from '@/features/auth/components/IdLoginForm.tsx';
import LoginTemplate from '@features/auth/components/LoginTemplate.tsx';
import { useAdminAuthStore } from '@/store/admin/adminAuthStore.tsx';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const login = useAdminAuthStore();

  return (
    <div>
      <LoginTemplate>
        <IdLoginForm
          fields={{
            UserId: 'adminLoginId',
            UserPassword: 'adminPassword',
          }}
          loginStore={login}
          onSuccess={() => navigate('/admin/main')}
        />
      </LoginTemplate>
    </div>
  );
};

export default AdminLoginPage;
