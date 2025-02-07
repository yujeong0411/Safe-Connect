import MainTemplate from '@components/templates/MainTemplate.tsx';
import HospitalListForm from '@features/hospital/components/HospitalListForm.tsx';
import {useHospitalAuthStore} from "@/store/hospital/hospitalAuthStore.tsx";

interface HospitalMainPageProps {
    type: 'request' | 'accept';  // 리터럴 타입으로 정의
}

const HospitalMainPage = ({type}:HospitalMainPageProps) => {
    const {logout} = useHospitalAuthStore();

  return (
    <MainTemplate
      navItems={[
        { label: '실시간 이송 요청', path: '/hospital/request' },
        { label: '이송 수락 목록', path: '/hospital/accept' },
      ]}
      logoutDirect={logout}
    >
        <HospitalListForm
        type={type}/>
    </MainTemplate>
  );
};

export default HospitalMainPage;
