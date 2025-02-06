import { useState } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import HospitalKakaoMap from '@/features/dispatch/components/Hospitalkakaomap';
import HospitalList from '@/features/dispatch/components/HospitalList';
import { Hospital } from '@/features/dispatch/types/hospital.types';
import { transferService } from '@/features/dispatch/sevices/transferservices';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal, CircleAlert, CircleCheckBig } from 'lucide-react';
import BulkTransferRequestDialog from '@/features/dispatch/components/BulkTransferRequestDialog';

const TransferRequestPage = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [showBulkRequestDialog, setShowBulkRequestDialog] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    description: string;
    type: 'default' | 'destructive' | 'success' | 'error'; // variant 타입 명시
  }>({
    title: '',
    description: '',
    type: 'default',
  });

  // 알림 처리
  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // 일괄 요청 처리
  const handleBulkRequest = async () => {
    if (!selectedHospital) {
      handleAlertClose({
        title: '병원 미선택',
        description: '이송을 요청할 병원을 선택해주세요.',
        type: 'error',
      });
      return;
    }

    setShowBulkRequestDialog(true);
  };

  // 실제 이송 요청 처리
  const handleTransferRequest = async () => {
    try {
      if (!selectedHospital) return;

      const hospital = hospitals.find((h) => h.place_name === selectedHospital);
      if (!hospital) return;

      await transferService.requestTransfer([hospital.id]);

      handleAlertClose({
        title: '이송 요청 전송',
        description: '이송 요청이 전송되었습니다.',
        type: 'success',
      });

      setShowBulkRequestDialog(false);
      setSelectedHospital(null);
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
        {/* 알림 표시 */}
        {showAlert && (
          <div className="fixed left-1/2 top-80 -translate-x-1/2 z-50">
            <Alert
              variant={
                alertConfig.type === 'success'
                  ? 'default'
                  : alertConfig.type === 'error'
                    ? 'destructive'
                    : 'default'
              }
              className={`w-[400px] shadow-lg bg-white ${
                alertConfig.type === 'success'
                  ? '[&>svg]:text-blue-600 text-blue-600'
                  : alertConfig.type === 'error'
                    ? '[&>svg]:text-red-500 text-red-500'
                    : '[&>svg]:text-black text-black'
              }`}
            >
              {alertConfig.type === 'success' ? (
                <CircleCheckBig className="h-6 w-6" />
              ) : alertConfig.type === 'error' ? (
                <CircleAlert className="h-6 w-6" />
              ) : (
                <Terminal className="h-6 w-6" />
              )}
              <AlertTitle className="text-lg ml-2">{alertConfig.title}</AlertTitle>
              <AlertDescription className="text-sm m-2">{alertConfig.description}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* 지도 */}
        <div className="absolute inset-0">
          <HospitalKakaoMap FindHospitals={setHospitals} />
        </div>

        {/* 병원 목록 */}
        <HospitalList
          hospitals={hospitals}
          selectedHospital={selectedHospital}
          onSelectHospital={setSelectedHospital}
          onBulkRequest={handleBulkRequest}
        />

        {/* 일괄 요청 모달 */}
        <BulkTransferRequestDialog
          open={showBulkRequestDialog}
          onClose={() => setShowBulkRequestDialog(false)}
          onConfirm={handleTransferRequest}
          hospitalName={selectedHospital || ''}
        />
      </div>
    </DispatchMainTemplate>
  );
};

export default TransferRequestPage;
