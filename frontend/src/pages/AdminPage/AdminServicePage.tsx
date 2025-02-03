import AdminMainTemplate from '@features/admin/components/AdminMainTemplate.tsx';
import AdminServiceForm from '@features/admin/components/AdminServiceForm.tsx';

const AdminServicePage = () => {
  const handleFetalAllData = () => {
    console.log('전체 서비스 로그 조회');
  };
  return (
    <AdminMainTemplate currentMenu="service" onButtonClick={handleFetalAllData}>
      <AdminServiceForm />
    </AdminMainTemplate>
  );
};

export default AdminServicePage;
