import { useState } from 'react';
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
    }, 3000);
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
    <DispatchMainTemplate logoutDirect={() => Promise.resolve()}>
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
