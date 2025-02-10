import MainTemplate from '@components/templates/MainTemplate.tsx';
import HospitalListForm from '@features/hospital/components/HospitalListForm.tsx';
import {useHospitalAuthStore} from "@/store/hospital/hospitalAuthStore.tsx";
import {useHospitalTransferStore} from "@/store/hospital/hospitalTransferStore.tsx";

interface HospitalMainPageProps {
    type: 'request' | 'accept';  // 리터럴 타입으로 정의
}

const HospitalMainPage = ({type}:HospitalMainPageProps) => {
    const {logout} = useHospitalAuthStore();
    const { combinedTransfers } = useHospitalTransferStore()

    // 이송 신청 온 목록(즉, 해당 페이지에 있는 리스트 수)
    const unacceptedTransfers = combinedTransfers ? combinedTransfers.filter(item => !item.transferAcceptAt).length
    : 0;

    // 이송 중인 항목 (transferAcceptAt은 있지만 transferArriveAt은 없는 항목)
    const transferringTransfers = combinedTransfers
        ? combinedTransfers.filter(item => item.transferAcceptAt && !item.transferArriveAt).length
        : 0;

  return (
    <MainTemplate
      navItems={[
        { label: '실시간 이송 요청', path: '/hospital/request', alarm:unacceptedTransfers > 0 ? unacceptedTransfers.toString() : undefined },
        { label: '이송 수락 목록', path: '/hospital/accept', alarm: transferringTransfers > 0 ? transferringTransfers.toString() : undefined },
      ]}
      logoutDirect={logout}
    >
        <HospitalListForm
        type={type}/>
    </MainTemplate>
  );
};

export default HospitalMainPage;
