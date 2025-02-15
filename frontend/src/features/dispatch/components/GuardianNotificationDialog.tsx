import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/atoms/Button/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CircleCheckBig, CircleAlert } from 'lucide-react';
import { useState } from "react";
import {useDispatchPatientStore} from "@/store/dispatch/dispatchPatientStore.tsx";

interface GuardianNotificationDialogProps {
  open: boolean;
  onClose: () => void;
  patientInfo: {
    name: string;
    hospitalName: string;
  };
  guardianContact: string;
}

const GuardianNotificationDialog = ({
  open,
  onClose,
  patientInfo,
}: GuardianNotificationDialogProps) => {
  const { sendProtectorMessage} = useDispatchPatientStore()
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive',
  });

  // 알림창 표시 핸들러
  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };


  const handleSendProtectorMessage = async () => {
    try {
      const transferId = 1;  // 아직 벡엔드 추가 안함. mockId
      const response = await sendProtectorMessage(transferId);
      if (response.isSuccess) {
        handleAlertClose({
          title: '메세지 전송 완료',
          description: '메세지가 전송되었습니다.',
          type: 'default',
        });
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      handleAlertClose({
        title: '메세지 전송 실패',
        description: '등록된 보호자가 없습니다.',
        type: 'destructive',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
      console.error("보호자 메세지 실패", error);
    }
  };


  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">보호자 메세지 전송</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-dialog_content p-4 rounded-lg">
              <p className="text-lg font-medium mb-4">
                [Safe Connect] {patientInfo.name} 님의 이송 안내 드립니다.
              </p>
              <div className="space-y-2 text-lg text-black">
                <p>▪️ 이송 병원: {patientInfo.hospitalName}</p>
                <p>▪️ 이송 상태: 이송 완료</p>
              </div>
              <div className="mt-4 space-y-2 text-gray-600">
                <p className="font-medium">※ 보호자님께 안내 말씀드립니다.</p>
                <p>1. 보호자님께서는 가능한 빨리 위 병원 응급실로 내원해 주시기 바랍니다.</p>
                <p>
                  2. 응급실 접수 시 "119 이송 환자"라고 말씀해 주시면 신속한 접수가
                  가능합니다.
                </p>
              </div>
              <p className="mt-4 text-sm text-blue-600">
                * Safe Connect가 환자분의 안전한 이송을 완료하였습니다. 빠른 쾌유를 기원합니다.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-2">
            <Button variant="blue" onClick={handleSendProtectorMessage}>
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
            <AlertDescription className="text-sm m-2">{alertConfig.description}</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default GuardianNotificationDialog;