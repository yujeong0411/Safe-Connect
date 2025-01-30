import MainTemplate from '@components/templates/MainTemplate.tsx';
import HospitalListForm from '@features/hospital/components/HospitalListForm.tsx';
const HospitalMainPage = () => {
  return (
    <MainTemplate
      navItems={[
        { label: '실시간 이송 요청', path: '/hospital/request' },
        { label: '이송 수락 목록', path: '/hospital/accpet' },
      ]}
    >
      <HospitalListForm />
    </MainTemplate>
  );
};

export default HospitalMainPage;
