import AdminMainTemplate from '@features/admin/components/AdminMainTemplate.tsx';
import AdminRegisterForm from '@features/admin/components/AdminRegisterForm.tsx';

interface AdminRegisterPageProps {
  userType: 'fire' | 'hospital';
}

// 병원, 소방 계정 둘 다 관리
const AdminRegisterPage = ({ userType }: AdminRegisterPageProps) => {
  return (
    <AdminMainTemplate currentMenu={userType}>
      <AdminRegisterForm userType={userType} />
    </AdminMainTemplate>
  );
};

export default AdminRegisterPage;
