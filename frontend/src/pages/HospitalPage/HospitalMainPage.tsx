import MainTemplate from '@components/templates/MainTemplate.tsx';
import HospitalListForm from '@features/hospital/components/HospitalListForm.tsx';
import { useHospitalAuthStore } from '@/store/hospital/hospitalAuthStore.tsx';
import { useHospitalTransferStore } from '@/store/hospital/hospitalTransferStore.tsx';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast.ts';
import { ToastAction } from '@components/ui/toast.tsx';
import { useSSE } from '@/hooks/useSSE.ts';
import HospitalDetailDialog from '@features/hospital/components/HospitalDetailDialog.tsx';
import { PatientDetailProps } from '@features/hospital/types/patientDetail.types.ts';
import { format } from 'date-fns';

interface HospitalMainPageProps {
  type: 'request' | 'accept'; // 리터럴 타입으로 정의
}

const HospitalMainPage = ({ type }: HospitalMainPageProps) => {
  const { logout, hospitalId } = useHospitalAuthStore();
  const { combinedTransfers, fetchCombinedTransfers } = useHospitalTransferStore();
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<PatientDetailProps['data']>({
    patientId: 0,
    name: null,
    gender: null,
    age: null,
    mental: '',
    preKTAS: '',
    sbp: 0,
    dbp: 0,
    pr: 0,
    bt: 0,
    spo2: 0,
    bst: 0,
    phone: '',
    protectorPhone: null,
    symptoms: '',
    requestTransferAt: '',
  });
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useSSE({
    subscribeUrl: '/api/hospital/subscribe',
    clientId: hospitalId!,
    onMessage: (response) => {
      console.log('response.data:', response.data);
      const patientData = response.data.patient;

      if (response.message === '환자 이송 요청이 접수되었습니다.') {
        toast({
          title: '신규 이송 요청',
          description: (
            <div className="mt-2 space-y-1">
              <p className="text-base">
                <span className="font-semibold">환자 정보:</span>
                {patientData.patientAge}/{patientData.patientGender}
              </p>
              <p className="text-base">
                <span className="font-semibold">증상:</span>
                {patientData.patientSympthom}
              </p>
              <p className="text-base">
                <span className="font-semibold">중증도:</span>
                <span
                  className={`ml-1 px-2 py-1 rounded text-xs ${
                    patientData.patientPreKtas === '1'
                      ? 'bg-red-500 text-white'
                      : patientData.patientPreKtas === '2'
                        ? 'bg-orange-500 text-white'
                        : patientData.patientPreKtas === '3'
                          ? 'bg-yellow-300 text-black'
                          : 'bg-green-100 text-green-800'
                  }`}
                >
                  KTAS {patientData.patientPreKtas}
                </span>
              </p>
            </div>
          ),
          action: (
            <ToastAction
              altText="상세보기"
              onClick={async () => {
                try {
                  const detailData = await useHospitalTransferStore
                    .getState()
                    .fetchTransferDetail(response.data.dispatchId, 'request');

                  setSelectedPatient({
                    patientId: detailData.patientId,
                    name: detailData.patientName ?? null,
                    gender: detailData.patientGender ?? null,
                    age: detailData.patientAge ?? null,
                    mental: detailData.patientMental,
                    preKTAS: patientData.patients?.[0]?.patientPreKtas??'',
                    sbp: detailData.patientSystolicBldPress,
                    dbp: detailData.patientDiastolicBldPress,
                    pr: detailData.patientPulseRate,
                    bt: detailData.patientTemperature,
                    spo2: detailData.patientSpo2,
                    bst: detailData.patientBloodSugar,
                    phone: detailData.userPhone,
                    protectorPhone: detailData.userProtectorPhone ?? null,
                    symptoms: detailData.patientSymptom,
                    diseases: detailData.patientDiseases?.join(', ') ?? undefined,
                    medications: detailData.patientMedications?.join(', ') ?? undefined,
                      requestTransferAt:'0'
                    //   requestTransferAt: format(
                    //   new Date(patientData.reqHospitalCreatedAt),
                    //   'yyyy-MM-dd HH:mm:ss'
                    // ),
                  });
                  setIsDetailOpen(true);
                } catch (error) {
                  console.error('상세 조회 실패:', error);
                }
              }}
            >
              상세보기
            </ToastAction>
          ),
          duration: 6000, // 시간 조정하기
          className: 'bg-white border-l-4 border-pink-400',
        });
        fetchCombinedTransfers();
      }
    },
  });

  // // 알림 권한 요청
  // useEffect(() => {
  //     if (Notification.permission === 'default') {
  //         Notification.requestPermission();
  //     }
  //
  //     if (!hospitalId) return;  // 병원 ID가 없으면 연결하지 않음
  //     console.log(`SSE 연결 시도: /api/hospital/subscribe?clientId=${hospitalId}`);
  //
  //     // SSE연결 (엔드포인트 넣기)
  //     const eventSource = new EventSource(`/api/hospital/subscribe?clientId=${hospitalId}`)
  //
  //     // 서버에서 메세지를 받을 때마다 실행
  //     eventSource.onmessage = (event) => {
  //         console.log('SSE 메시지 수신:', event.data);
  //         const response = JSON.parse(event.data);
  //
  //         // 응답 데이터 구조 확인
  //         console.log('파싱된 응답:', response);
  //
  //         // data 필드에서 환자 정보 추출
  //         const patientData = response.data.patient; // ResponseUtil.success() 형식
  //
  //         // 새로운 이송 요청이 왔을 때
  //         if (response.message === "환자 이송 요청이 접수되었습니다.") {
  //             // shadcn toast 사용
  //             toast({
  //                 title: "신규 이송 요청",
  //                 description: (
  //                     <div className="mt-2 space-y-1">
  //                         <p className="text-sm">
  //                             <span className="font-semibold">환자 정보:</span>
  //                             {patientData.patientAge}세, {patientData.patientGender}
  //                         </p>
  //                         <p className="text-sm">
  //                             <span className="font-semibold">증상:</span>
  //                             {patientData.patientSympthom}
  //                         </p>
  //                         <p className="text-sm">
  //                             <span className="font-semibold">중증도:</span>
  //                             <span className={`ml-1 px-2 py-1 rounded text-xs ${
  //                                 patientData.patientPreKtas === "1" ? "bg-red-100 text-red-800" :
  //                                     patientData.patientPreKtas === "2" ? "bg-orange-100 text-orange-800" :
  //                                         patientData.patientPreKtas === "3" ? "bg-yellow-100 text-yellow-800" :
  //                                             "bg-green-100 text-green-800"
  //                             }`}>
  //                                 KTAS {patientData.patientPreKtas}
  //                             </span>
  //                         </p>
  //                     </div>
  //                 ),
  //                 action: (
  //                     <ToastAction altText="상세보기" onClick={() => {/* 상세보기 로직 */}}>
  //                         상세보기
  //                     </ToastAction>
  //                 ),
  //                 duration: 5000,  // 5초 동안 표시
  //                 className: "bg-white border-l-4 border-blue-500"
  //             });
  //
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
  // }, [hospitalId])   // hospitalInfo.id가 변경될 때마다 재연결

  // 이송 신청 온 목록(즉, 해당 페이지에 있는 리스트 수)
  const unacceptedTransfers = combinedTransfers
    ? combinedTransfers.filter((item) => !item.transferAcceptAt && !item.dispatchTransferAccepted).length
    : 0;

  // 이송 중인 항목 (transferAcceptAt은 있지만 transferArriveAt은 없는 항목)
  const transferringTransfers = combinedTransfers
    ? combinedTransfers.filter((item) => item.transferAcceptAt && !item.transferArriveAt).length
    : 0;

  return (
    <MainTemplate
      navItems={[
        {
          label: '실시간 이송 요청',
          path: '/hospital/request',
          alarm: unacceptedTransfers > 0 ? unacceptedTransfers.toString() : undefined,
        },
        {
          label: '이송 수락 목록',
          path: '/hospital/accept',
          alarm: transferringTransfers > 0 ? transferringTransfers.toString() : undefined,
        },
      ]}
      logoutDirect={logout}
    >
      <HospitalListForm type={type} />

      <HospitalDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        data={selectedPatient}
      />
    </MainTemplate>
  );
};

export default HospitalMainPage;
