import { useEffect, useState } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import HospitalKakaoMap from '@/features/dispatch/components/Hospitalkakaomap';
import HospitalList from '@/features/dispatch/components/HospitalList';
import { useHospitalSearch } from '@/hooks/useHospitalSearch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CircleAlert, CircleCheckBig } from 'lucide-react';
import { TransferRequestResponse } from '@/types/dispatch/dispatchTransferResponse.types';
import { useDispatchSseStore } from '@/store/dispatch/dispatchSseStore';

interface AlertConfig {
  title: string;
  description: string;
  type: 'default' | 'destructive' | 'success' | 'error';
}

// SSE 응답 타입 정의
// interface SSEResponse {
//   isSuccess: boolean;
//   code: number;
//   message: string;
//   data: {
//     dispatchId?: number;
//     hospitalNames?: string[];
//     patientId?: number;
//     hospitalId?: number;
//     hospitalName?: string;
//     latitude?: number;
//     longitude?: number;
//   };
// }

const TransferRequestPage = () => {
  const {
    hospitals,
    searchRadius, // lastSearchedRadius 대신 사용
    handleSearch,
    stopSearch,
    currentLocation,
    isSearching,
    error: searchError,
  } = useHospitalSearch();


  // const [showBulkRequestDialog, setShowBulkRequestDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | undefined>();
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
    }, 1000);
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
        description: `주변 병원 자동 검색을 시작합니다.`,
        type: 'default',
      });
    }
  };

  const handleHospitalSelect = (hospitalId: number) => {
    setSelectedHospitalId(hospitalId);
  };

  const eventSource = useDispatchSseStore((state) => state.eventSource);
  const acceptedHospital = useDispatchSseStore((state) => state.acceptedHospital);

  // 환자 이송 요청 (핸들러 등록을 여기서)
  useEffect(() => {
    const handleTransferRequest = (event: MessageEvent) => {
      try {
        const response: TransferRequestResponse = JSON.parse(event.data);
        if (response.isSuccess) {
          handleAlertClose({
            title: '환자 이송 요청 전송',
            description: `${searchRadius}km 반경 내 병원들에 이송 요청을 전송했습니다.\n\n요청 병원 목록:\n${response.data.hospitalNames?.map((hospital) => `- ${hospital}`).join('\n')}`,
            type: 'default',
          });
        }
        console.log("transfer-request", response);
      } catch (error) {
        console.error("SSE 데이터 처리 오류", error);
      }
    };

    if (eventSource) {
      eventSource.addEventListener("transfer-request", handleTransferRequest);
      
      // SSE 연결 오류 처리
      eventSource.onerror = (error) => {
        // handleAlertClose({
        //   title: '연결 오류',
        //   description: '실시간 알림 연결에 실패했습니다. 페이지를 새로고침해주세요.',
        //   type: 'error',
        // });
        console.error("SSE 연결 오류: ", error);
      };
    }

    return () => {
      // 페이지 벗어나면 리스너 제거
      if (eventSource) {
        eventSource.removeEventListener("transfer-request", handleTransferRequest);
      }
    };
  }, [eventSource, searchRadius]);

  // 이송 수락 응답 처리
  useEffect(() => {
    if (acceptedHospital) {
      handleAlertClose({
        title: "환자 이송 요청 수락",
        description: `이송 병원: ${acceptedHospital.hospitalName}`,
        type: "success",
      });

      stopSearch();
      useDispatchSseStore.getState().setAcceptedHospital(null); // 수락 병원 데이터 초기화
    }
  }, [acceptedHospital]);


    // // 이송 요청 결과 수신
    // eventSource.addEventListener('transfer-request', (event) => {
    //   try {
    //     const response = JSON.parse(event.data) as SSEResponse;
    //     if (response.isSuccess) {
    //       handleAlertClose({
    //         title: '환자 이송 요청 전송',
    //         description: `${searchRadius}km 반경 내 병원들에 이송 요청을 전송했습니다.\n\n요청 병원 목록:\n${response.data.hospitalNames?.map((hospital) => `- ${hospital}`).join('\n')}`,
    //         type: 'default',
    //       });
    //     }
    //   } catch (error) {
    //     console.error('이송 요청 메시지 처리 중 오류 발생: ', error);
    //   }
    // });

    // 병원 응답 수신
    // eventSource.addEventListener('hospital-response', (event) => {
    //   try {
    //     const response = JSON.parse(event.data) as SSEResponse;
    //     if (response.isSuccess && response.data) {
    //       handleAlertClose({
    //         title: '환자 이송 수락',
    //         description: `환자 이송이 수락되었습니다.\n이송 병원: ${response.data.hospitalName}`,
    //         type: 'success',
    //       });

    //       if (
    //         response.data.hospitalId &&
    //         response.data.hospitalName &&
    //         response.data.latitude != null &&
    //         response.data.longitude != null
    //       ) {
    //         // 수락된 병원 정보 저장
    //         setAcceptedHospital({
    //           hospitalId: response.data.hospitalId,
    //           hospitalName: response.data.hospitalName,
    //           latitude: response.data.latitude,
    //           longitude: response.data.longitude,
    //         });

    //         // 환자 이송 상태 업데이트 (hospital store)
    //         if (response.data.patientId) {
    //           updateTransferStatus(response.data.patientId, 'ACCEPTED');
    //         }

    //         // 검색 중지
    //         stopSearch();
    //       }
    //     }
    //   } catch (error) {
    //     console.error('병원 응답 메시지 처리 중 오류 발생: ', error);
    //   }
    // });

    // eventSource.onerror = (error) => {
    //   console.error('SSE 연결 에러: ', error);
    //   handleAlertClose({
    //     title: '연결 오류',
    //     description: '실시간 알림 연결에 실패했습니다. 페이지를 새로고침해주세요.',
    //     type: 'error',
    //   });
    //   eventSource.close();
    // };

    // return () => {
    //   eventSource.close();
    // };
  // }, [stopSearch, searchRadius, updateTransferStatus]);

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
              <AlertDescription className="whitespace-pre-line">
                {alertConfig.description}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* 검색 에러 알림 */}
        {searchError && (
          <div className="fixed right-4 top-20 z-50">
            <Alert variant="destructive" className="w-[400px] shadow-lg">
              <CircleAlert className="h-6 w-6" />
              <AlertTitle>검색 오류</AlertTitle>
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* 지도 */}
        <HospitalKakaoMap
          currentLocation={currentLocation}
          hospitals={hospitals}
          onHospitalSelect={handleHospitalSelect}
          selectedHospitalId={selectedHospitalId}
        />

        <HospitalList
          hospitals={hospitals}
          searchRadius={searchRadius}
          onSearch={handleSearchStart}
          isSearching={isSearching}
          selectedHospitalId={selectedHospitalId}
          onHospitalSelect={handleHospitalSelect}
        />
      </div>
    </DispatchMainTemplate>
  );
};

export default TransferRequestPage;
