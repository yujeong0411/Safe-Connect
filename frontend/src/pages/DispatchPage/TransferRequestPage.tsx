import { useEffect, useState } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import HospitalKakaoMap from '@/features/dispatch/components/Hospitalkakaomap';
import HospitalList from '@/features/dispatch/components/HospitalList';
import { useHospitalSearch } from '@/hooks/useHospitalSearch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CircleAlert, CircleCheckBig } from 'lucide-react';
import { useDispatchSseStore } from '@/store/dispatch/dispatchSseStore';
import { useDispatchPatientStore } from '@/store/dispatch/dispatchPatientStore';
import { Hospital } from '@/features/dispatch/types/hospital.types';
import { transferDetail } from '@features/dispatch/sevices/dispatchServiece.ts';

interface AlertConfig {
  title: string;
  description: string;
  type: 'default' | 'destructive';
}

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
    const [showAlert, setShowAlert] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | undefined>();
  const [displayedHospitals, setDisplayedHospitals] = useState<Hospital[]>(hospitals);
  const formData = useDispatchPatientStore(state => state.formData);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    title: '',
    description: '',
    type: 'default',
  });
  const [emphasize,setEmphasize] = useState<boolean>(false);
  const {setTransferInfo} = useDispatchPatientStore();
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
        JSON.parse(event.data);
      } catch (error) {
        console.error("SSE 데이터 처리 오류", error);
      }
    };

    if (eventSource) {
      eventSource.addEventListener("transfer-request", handleTransferRequest);
      
      // SSE 연결 오류 처리
      eventSource.onerror = (error) => {
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
    const fetchData = async () => {
      if (acceptedHospital) {
        // 수락된 병원만 필터링하여 표시
        const acceptedHospitalData = hospitals.find(
          h => h.hospitalId === acceptedHospital.hospitalId
        );

        if (acceptedHospitalData) {
          setDisplayedHospitals([acceptedHospitalData]);
          setSelectedHospitalId(acceptedHospital.hospitalId);
        }
        const response = await transferDetail(acceptedHospital.transferId)


        setTransferInfo(response)

        // // 알림 표시
        // handleAlertClose({
        //   title: "환자 이송 요청 수락",
        //   description: `이송 병원: ${acceptedHospital.hospitalName}`,
        //   type: "default",
        // });

        // 검색 중지
        stopSearch();
        setEmphasize(true);
      } else {
        setDisplayedHospitals(hospitals);
      }
    };

    fetchData();

    // If you need cleanup, you can still return a cleanup function
    return () => {
      // cleanup code here if needed
    };
  }, [hospitals, acceptedHospital, stopSearch]);

  return (
    <DispatchMainTemplate>
      <div className="relative h-screen">
        {/* 시스템 알림 */}
        {showAlert && (
            <div className="fixed left-1/2 top-80 -translate-x-1/2 z-[999]">
              <Alert
                  variant={alertConfig.type}
                  className="w-[400px] shadow-lg bg-white"
              >
                {alertConfig.type === 'default' ? (
                    <CircleCheckBig className="h-6 w-6" />
                ) : (
                    <CircleAlert className="h-6 w-6" />
                )}
                <AlertTitle className="text-lg ml-2">{alertConfig.title}</AlertTitle>
                <AlertDescription className="text-base m-2">{alertConfig.description}</AlertDescription>
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
          hospitals={displayedHospitals}
          onHospitalSelect={handleHospitalSelect}
          selectedHospitalId={selectedHospitalId}
          callerLocation={formData.callerLocation}
          emphasize = {emphasize}
        />

        <HospitalList
          hospitals={displayedHospitals}
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
