import MainTemplate from '@components/templates/MainTemplate.tsx';
import HospitalListForm from '@features/hospital/components/HospitalListForm.tsx';
import {useHospitalAuthStore} from "@/store/hospital/hospitalAuthStore.tsx";
import {useHospitalTransferStore} from "@/store/hospital/hospitalTransferStore.tsx";
// import {useEffect} from "react";

interface HospitalMainPageProps {
    type: 'request' | 'accept';  // 리터럴 타입으로 정의
}

const HospitalMainPage = ({type}:HospitalMainPageProps) => {
    const {logout} = useHospitalAuthStore();
    const { combinedTransfers } = useHospitalTransferStore()

    // // 알림 권한 요청
    // useEffect(() => {
    //     if (Notification.permission === 'default') {
    //         Notification.requestPermission();
    //     }
    //
    //     // SSE연결
    //     const eventSource = new EventSource('')
    //
    //     // 서버에서 메세지를 받을 때마다 실행
    //     eventSource.onmessage = (event) => {
    //         const newTransfer = JSON.parse(event.data);
    //
    //         // 새로운 요청 시
    //         if (!newTransfer.transferAcceptAt) {
    //             // 브라우저 알림
    //             if (Notification.permission === 'granted') {
    //                 new Notification("신규 이송 요청", {
    //                     body: `환자 정보: ${newTransfer.patients?.[0]?.patientAge}세, ${newTransfer.patients?.[0]?.patientGender}, ${newTransfer.patients?.[0]?.patientPreKtas}`,
    //                 })
    //             }
    //             // 데이터 새로 고침
    //             fetchCombinedTransfers()
    //         }
    //     }
    //     eventSource.onerror = (error) => {
    //         console.error("SSE", error);
    //         eventSource.close()
    //     }
    //     return () => {
    //         eventSource.close()
    //     }
    // }, [])
    //

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
