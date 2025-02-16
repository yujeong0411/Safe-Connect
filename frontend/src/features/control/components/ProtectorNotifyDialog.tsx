import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogProps } from '../types/dialog.types';
import { usePatientStore } from '@/store/control/patientStore.tsx';
import { Alert, AlertTitle, AlertDescription } from '@components/ui/alert.tsx';
import { CircleCheckBig, CircleAlert } from 'lucide-react';
import { useState } from 'react';
import {useOpenViduStore} from "@/store/openvidu/OpenViduStore.tsx";

const ProtectorNotifyDialog = ({ open, onOpenChange }: DialogProps) => {
  const { sendProtectorMessage, patientInfo } = usePatientStore();
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive',
  });
  const {callStartedAt} = useOpenViduStore()


  // 알림창 표시 핸들러
  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (patientInfo?.userPhone) {
      try {
        const success = await sendProtectorMessage(patientInfo.userPhone);
        if (success) {
          // window.alert('보호자 알림 전송이 완료되었습니다.');
          handleAlertClose({
            title: '알림 전송 완료',
            description: '보호자 알림이 전송되었습니다.',
            type: 'default',
          });
          setTimeout(() => {
            onOpenChange(false);
          }, 1000);
        }
      } catch (error) {
        handleAlertClose({
          title: '전송 실패',
          description: '등록된 보호자가 없습니다.',
          type: 'destructive',
        });
        setTimeout(() => {
          onOpenChange(false);
        }, 1000);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[600px] p-8 bg-dialog_color">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">보호자 알림 전송</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 mb-2">메세지</p>
              <div className="bg-[#EBEDF3] p-5 rounded-md mb-2 whitespace-pre-line">
                [Safe Connect] 응급 신고 접수 알림 <br />
                <br />[{patientInfo?.userName || '환자'}]님의 119 신고가 접수되었습니다.
                <br />
                ▪️신고 시각 : {callStartedAt
                  ? new Date(callStartedAt).toLocaleString('ko-KR', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }).replace(/\./g, '.').replace(/ /g, ' ')
                  : '알 수 없음'}
                <br />
                ▪️현재 상태 : 구급대원 출동 중<br />
                <br />
                * 환자의 위치로 이동 중이신 경우, 안전운전 바랍니다.
                <br />* Safe Connect이 최선을 다해 환자를 지원하고 있습니다.
              </div>
            </div>

            <Button
              className="w-full bg-banner hover:bg-[#697383] text-white text-md py-6"
              onClick={handleSendMessage}
            >
              전송
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {showAlert && (
        <div className="fixed left-1/2 top-80 -translate-x-1/2 z-[999]">
          <Alert
            variant={alertConfig.type}
            className={`w-[400px] shadow-lg bg-white ${
              alertConfig.type === 'default'
                ? '[&>svg]:text-blue-600 text-blue-600'
                : '[&>svg]:text-red-500 text-red-500'
            }`}
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
    </>
  );
};

export default ProtectorNotifyDialog;
