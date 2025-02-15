// src/pages/TransferRequestPage.tsx
import { useEffect, useState } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import HospitalKakaoMap from '@/features/dispatch/components/Hospitalkakaomap';
import HospitalList from '@/features/dispatch/components/HospitalList';
import BulkTransferRequestDialog from '@/features/dispatch/components/BulkTransferRequestDialog';
import { useHospitalSearch } from '@/hooks/useHospitalSearch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CircleAlert, CircleCheckBig } from 'lucide-react';

interface AlertConfig {
  title: string;
  description: string;
  type: 'default' | 'destructive' | 'success' | 'error';
}

const TransferRequestPage = () => {
  const {
    hospitals,
    searchRadius,
    handleSearch,
    stopSearch,
    requestTransfer,
    markHospitalsAsRequested,
    currentLocation,
    isSearching,
    error
  } = useHospitalSearch();

  const [showBulkRequestDialog, setShowBulkRequestDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    title: '',
    description: '',
    type: 'default',
  });

  const handleAlertClose = (config: AlertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 10000);
  };

  const handleSearchStart = () => {
    if (isSearching) {
      stopSearch();
      handleAlertClose({
        title: '검색 종료',
        description: '병원 검색이 종료되었습니다.',
        type: 'default',
      });
    } else {
      handleSearch();
      handleAlertClose({
        title: '검색 시작',
        description: '주변 병원 검색을 시작합니다.',
        type: 'default',
      });
    }
  };

  const handleBulkRequest = () => {
    const availableHospitals = hospitals.filter((h) => !h.requested);
    if (availableHospitals.length === 0) {
      handleAlertClose({
        title: '요청 불가',
        description: '요청 가능한 병원이 없습니다.',
        type: 'error',
      });
      return;
    }
    setShowBulkRequestDialog(true);
  };

  const handleTransferRequest = async () => {
    const availableHospitals = hospitals.filter((h) => !h.requested);
    const hospitalIds = availableHospitals.map((h) => h.hospitalId);

    const success = await requestTransfer(hospitalIds);

    if (success) {
      handleAlertClose({
        title: '이송 요청 전송',
        description: `${availableHospitals.length}개 병원에 이송 요청이 전송되었습니다.`,
        type: 'success',
      });
      setShowBulkRequestDialog(false);
    }
  };

  // SSE 연결 설정
// TransferRequestPage.tsx에서 SSE 연결 부분 수정
useEffect(() => {
  const dispatchLoginId = sessionStorage.getItem("userName");
  if (!dispatchLoginId) {
    console.log("구급팀 정보가 없습니다.");
    return;
  }

  // baseURL을 axiosInstance와 동일하게 사용
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const eventSource = new EventSource(`${baseURL}/dispatchGroup/subscribe?clientId=${dispatchLoginId}`);

  type SSEResponse = {
    isSuccess: boolean;
    code: number;
    message: string;
    data: {
      dispatchId?: number;
      hospitalNames?: string[];
      patientId?: number;
      hospitalId?: number;
      hospitalName?: string;
    };
  };

  eventSource.onmessage = (event) => {
    try {
      const response = JSON.parse(event.data) as SSEResponse;
      
      if (response.message === "환자 이송 요청이 접수되었습니다.") {
        handleAlertClose({
          title: "환자 이송 요청 전송",
          description: `환자 이송을 요청했습니다.\n요청 병원: ${response.data.hospitalNames?.join(', ')}`,
          type: "default"
        });
      } else if (response.message === "환자 이송 요청이 승인되었습니다.") {
        handleAlertClose({
          title: "환자 이송 수락",
          description: `환자 이송이 수락되었습니다.\n이송 병원: ${response.data.hospitalName}`,
          type: "success"
        });
      } else {
        handleAlertClose({
          title: "요청 처리 실패",
          description: "처리 중 오류가 발생했습니다.",
          type: "error"
        });
      }
    } catch (error) {
      console.error("SSE 메시지 처리 중 오류:", error);
    }
  };

  eventSource.onerror = (error) => {
    console.error("SSE 연결 에러: ", error);
    handleAlertClose({
      title: "연결 오류",
      description: "실시간 알림 연결에 실패했습니다. 페이지를 새로고침해주세요.",
      type: "error"
    });
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
}, []);

  return (
    <DispatchMainTemplate>
      <div className="relative h-screen">
        {/* 시스템 알림 */}
        {showAlert && (
          <div className="fixed left-1/2 top-20 -translate-x-1/2 z-50">
            <Alert
              variant={alertConfig.type === 'success' ? 'default' : 'destructive'}
              className="w-[400px] shadow-lg bg-white"
            >
              {alertConfig.type === 'success' ? (
                <CircleCheckBig className="h-6 w-6" />
              ) : (
                <CircleAlert className="h-6 w-6" />
              )}
              <AlertTitle>{alertConfig.title}</AlertTitle>
              <AlertDescription>{alertConfig.description}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="fixed right-4 top-20 z-50">
            <Alert variant="destructive" className="w-[400px] shadow-lg">
              <CircleAlert className="h-6 w-6" />
              <AlertTitle>오류 발생</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* 지도 */}
        <div className="absolute inset-0">
          <HospitalKakaoMap currentLocation={currentLocation} hospitals={hospitals} />
        </div>

        {/* 병원 목록 */}
        <HospitalList
          hospitals={hospitals}
          searchRadius={searchRadius}
          onSearch={handleSearchStart}
          onBulkRequest={handleBulkRequest}
          isSearching={isSearching}
        />

        {/* 이송 요청 다이얼로그 */}
        <BulkTransferRequestDialog
          open={showBulkRequestDialog}
          onClose={() => setShowBulkRequestDialog(false)}
          onConfirm={handleTransferRequest}
          hospitalNames={hospitals.filter((h) => !h.requested).map((h) => h.hospitalName)}
        />
      </div>
    </DispatchMainTemplate>
  );
};

export default TransferRequestPage;