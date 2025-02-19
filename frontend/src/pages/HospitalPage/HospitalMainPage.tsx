import MainTemplate from '@components/templates/MainTemplate.tsx';
import HospitalListForm from '@features/hospital/components/HospitalListForm.tsx';
import { useHospitalAuthStore } from '@/store/hospital/hospitalAuthStore.tsx';
import { useHospitalTransferStore } from '@/store/hospital/hospitalTransferStore.tsx';
import { useRef, useState} from 'react';
import { useToast } from '@/hooks/use-toast.ts';
import { ToastAction } from '@components/ui/toast.tsx';
import HospitalDetailDialog from '@features/hospital/components/HospitalDetailDialog.tsx';
import { PatientDetailProps } from '@features/hospital/types/patientDetail.types.ts';
//import { format } from 'date-fns';
import {useEffect} from "react";
import {EventSourcePolyfill} from "event-source-polyfill";

interface HospitalMainPageProps {
  type: 'request' | 'accept'; // 리터럴 타입으로 정의
}

const HospitalMainPage = ({ type }: HospitalMainPageProps) => {
  const { logout } = useHospitalAuthStore();
  const { combinedTransfers, fetchCombinedTransfers } = useHospitalTransferStore();
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<PatientDetailProps['data']>({
    dispatchId:0,
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

  // SSE 관련
  const [sseConnected, setSseConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RETRIES = 5;
  const INITIAL_RETRY_DELAY = 1000;
  const RECONNECT_INTERVAL = 1500000;

  const dispatchAccepted = (dispatchId:number)=>{
    // type이 request일 때만 처리
    if (type === 'request') {
      // const toastId = toastIdsMap.get(dispatchId);
      // if (toastId) {
      //   toast.dismiss(toastId);
      //   toastIdsMap.delete(dispatchId);
      // }

      // 모달이 열려있고, 해당 dispatch가 수락된 경우
      if (isDetailOpen && dispatchId === Number(selectedPatient.dispatchId)) {
        setIsDetailOpen(false); // 모달 닫기
        toast({
          description: "다른 병원에서 이미 수락한 이송 요청입니다.",
          duration: 1000,
        });
      }

      // 전체 목록에서 해당 dispatch 제거
      const updatedTransfers = combinedTransfers.filter(
        transfer => transfer.dispatchId !== dispatchId
      );
      // Store 업데이트
      useHospitalTransferStore.setState({ combinedTransfers: updatedTransfers });
    }
  }



  const showTransferRequestToast = (patientData: any, response: any) => {
    toast({
      description: (
          <div className="mt-1 space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-sans font-semibold">신규 이송 요청</h2>
              <span
                  className={`px-2 py-1 rounded text-md ${
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
            </div>
            <p>
                <span className="text-base font-sans">
                  환자 정보 : {patientData.patientAge}세 / {patientData.patientGender}
                </span>
            </p>
            <p>
              <span className="text-base font-sans">증상 : {patientData.patientSympthom}</span>
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
                    dispatchId : response.dispatchId,
                    patientId: detailData.patientId,
                    name: detailData.patientName ?? null,
                    gender: detailData.patientGender ?? null,
                    age: detailData.patientAge ?? null,
                    mental: detailData.patientMental,
                    preKTAS: detailData.patientPreKtas,
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
                    requestTransferAt: '0',
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
      duration: 60000,
      className: 'bg-white border-l-4 border-pink-400',
    });
    // 데이터 새로 고침
    fetchCombinedTransfers();
  };

  const connectSSE = () => {
    if (sseConnected && eventSourceRef.current) {
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("토큰을 찾을 수 없습니다.");
      return;
    }

    let subscribeUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    if (subscribeUrl !== "http://localhost:8080") {
      subscribeUrl += "/api"
    }

    try {
      const newEventSource = new EventSourcePolyfill(`${subscribeUrl}/hospital/subscribe`,
        { 
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true
        }
      );

      newEventSource.addEventListener("transfer-request", (event) => {
        const response = JSON.parse((event as MessageEvent).data);
        showTransferRequestToast(response.data.patient, response);
        fetchCombinedTransfers();
      });

      newEventSource.addEventListener("transfer-accepted", (event) => {
        const response = JSON.parse((event as MessageEvent).data);
        dispatchAccepted(response.data.dispatchId);
      })

      newEventSource.onopen = () => {
        setSseConnected(true);
        setRetryCount(0),
        startReconnectTimer();
      };

      newEventSource.onerror = (error) => {
        console.error("SSE 연결 에러: ", error);
        setSseConnected(false);

        if (retryCount < MAX_RETRIES) {
          const nextRetryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);

          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            connectSSE();
          }, nextRetryDelay);
        } else {
          disconnect();
        }
      };

      eventSourceRef.current = newEventSource;
    } catch (error) {
      console.error("EventSource 생성 중 에러 발생: ", error);
      setSseConnected(false);
    }
  };

  const startReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    reconnectTimerRef.current = setTimeout(() => {
      disconnect();
      connectSSE();
    }, RECONNECT_INTERVAL);
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    setSseConnected(false);
    setRetryCount(0);
  };

  useEffect(() => {
    // 알림 권한 요청
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  
    const token = sessionStorage.getItem("token");
    if (token && !sseConnected) {
      connectSSE();
    }

    return () => {
      disconnect();
    };
  }, []);

  // 목록 카운트 계산
  const unacceptedTransfers = combinedTransfers
  ? combinedTransfers.filter((item) => !item.transferAcceptAt && !item.dispatchTransferAccepted)
      .length
  : 0;

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
