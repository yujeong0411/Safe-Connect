import { useEffect, useState } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import HospitalKakaoMap from '@/features/dispatch/components/Hospitalkakaomap';
import HospitalList from '@/features/dispatch/components/HospitalList';
import BulkTransferRequestDialog from '@/features/dispatch/components/BulkTransferRequestDialog';
import { useHospitalSearch } from '@/hooks/useHospitalSearch';
import { transferService } from '@/features/dispatch/sevices/transferservices';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CircleAlert, CircleCheckBig } from 'lucide-react';

interface AlertConfig {
  title: string;
  description: string;
  type: 'default' | 'destructive' | 'success' | 'error';
}

interface BaseResponse {
  isSuccess: boolean;
  code: number;
  message: string;
}

interface TransferRequestResponse extends BaseResponse {
  data: {
    dispatchId: number;
    hospitalNames: string[];
    patientId: number;
  }
}

interface TransferAcceptedResponse extends BaseResponse {
  data: {
    hospitalId: number;
    hospitalName: string;
  }
}

const TransferRequestPage = () => {
  const {
    hospitals,
    searchRadius,
    handleSearch,
    markHospitalsAsRequested,
    currentLocation,
    isSearching
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

  useEffect(() => {
    const dispatchLoginId = localStorage.getItem("userName");
    if (!dispatchLoginId) {
      console.log("구급팀 정보가 없습니다.");
      return;
    }

    // SSE 연결
    // const eventSource = new EventSource(`http://localhost:8080/dispatchGroup/transfer/subscribe?clientId=${dispatchLoginId}`);
    const eventSource = new EventSource(`https://i12c207.p.ssafy.io/api/dispatchGroup/subscribe?clientId=${dispatchLoginId}`);

    // 메시지 수신 처리
    type SSEResponse = TransferRequestResponse | TransferAcceptedResponse;

    eventSource.onmessage = (event) => {
      const response = JSON.parse(event.data) as SSEResponse;
      // 구급팀 -> 병원 이송 요청 전송
      if (response.message === "환자 이송 요청이 접수되었습니다.") {
        handleAlertClose({
          title: "환자 이송 요청 전송",
          description: `환자 이송을 요청했습니다.\n요청 병원: ${(response as TransferRequestResponse).data.hospitalNames}`,
          type: "default"
        });
      } 
      // 병원 -> 이송 요청 수락
      else if (response.message === "환자 이송 요청이 승인되었습니다.") {
        handleAlertClose({
          title: "환자 이송 수락",
          description: `환자 이송이 수락되었습니다.\n이송 병원: ${(response as TransferAcceptedResponse).data.hospitalName}`,
          type: "default"
        });
      }
      // 그 외 모든 경우 (에러)
      else {
        handleAlertClose({
          title: "요청 처리 실패",
          description: "처리 중 오류가 발생했습니다.",
          type: "destructive"
        });
      }
    };

    // 에러 처리
    eventSource.onerror = (error) => {
      console.error("SSE 연결 에러: ", error);
      eventSource.close();
    };

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      eventSource.close();
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행

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
    try {
      const availableHospitals = hospitals.filter((h) => !h.requested);
      const hospitalIds = availableHospitals.map((h) => h.id);

      await transferService.requestTransfer(hospitalIds);
      markHospitalsAsRequested(hospitalIds);

      handleAlertClose({
        title: '이송 요청 전송',
        description: `${availableHospitals.length}개 병원에 이송 요청이 전송되었습니다.`,
        type: 'success',
      });

      setShowBulkRequestDialog(false);
    } catch (error) {
      handleAlertClose({
        title: '이송 요청 실패',
        description: '이송 요청 전송에 실패했습니다.',
        type: 'error',
      });
    }
  };

  return (
    <DispatchMainTemplate>
      <div className="relative h-screen">
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

<div className="absolute inset-0">
          <HospitalKakaoMap currentLocation={currentLocation} hospitals={hospitals} />
        </div>

        <HospitalList
          hospitals={hospitals}
          searchRadius={searchRadius}
          onSearch={handleSearch}
          onBulkRequest={handleBulkRequest}
          isSearching={isSearching}
        />

        <BulkTransferRequestDialog
          open={showBulkRequestDialog}
          onClose={() => setShowBulkRequestDialog(false)}
          onConfirm={handleTransferRequest}
          hospitalNames={hospitals.filter((h) => !h.requested).map((h) => h.place_name)}
        />
      </div>
    </DispatchMainTemplate>
  );
};

export default TransferRequestPage;
