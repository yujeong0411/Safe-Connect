import AdminMainTemplate from '@features/admin/components/AdminMainTemplate.tsx';
import AdminServiceForm from '@features/admin/components/AdminServiceForm.tsx';

const AdminServicePage = () => {
  return (
    <AdminMainTemplate currentMenu="service">
      <AdminServiceForm />
    </AdminMainTemplate>
  );
};

export default AdminServicePage;
