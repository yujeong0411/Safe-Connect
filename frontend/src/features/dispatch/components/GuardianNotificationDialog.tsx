import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/atoms/Button/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CircleCheckBig, CircleAlert } from 'lucide-react';
import { useState } from "react";
import {useDispatchPatientStore} from "@/store/dispatch/dispatchPatientStore.tsx";
import { useNavigate } from 'react-router-dom';

interface GuardianNotificationDialogProps {
  open: boolean;
  onClose: () => void;
}

const GuardianNotificationDialog = ({
  open,
  onClose,
}: GuardianNotificationDialogProps) => {
  const { formData, currentTransfer, sendProtectorMessage, completeTransfer} = useDispatchPatientStore()
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive',
  });
  const {resetPatientInfo} = useDispatchPatientStore()
  const navigate = useNavigate();

  // 알림창 표시 핸들러
  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  // 이송 종료
  const handleCompelete = async () => {
    if (!currentTransfer?.transferId) {
      handleAlertClose({
        title: '처리 실패',
        description: '이송 정보가 없습니다.',
        type: 'destructive',
      });
      return;
    }

    try {
      // 이송 종료 처리 (유저 + 비유저)
      const transferResponse = await completeTransfer(currentTransfer.transferId)
      if (transferResponse.isSuccess) {
        handleAlertClose({
          title: formData.patientIsUser ? '처리 완료' : '이송 종료',
          description: formData.patientIsUser
              ? '보호자 알림 전송과 이송 종료가 완료되었습니다.'
              : '이송이 종료되었습니다.',
          type: 'default',
        });
    }
    if (formData.patientIsUser && formData.patientProtectorPhone) {
      await sendProtectorMessage();
      navigate('/dispatch/main')
      resetPatientInfo()
    }

 } catch (error) {
    handleAlertClose({
      title: '처리 실패',
      description: formData.patientIsUser
          ? '보호자 알림 전송 또는 이송 종료에 실패했습니다.'
          : '이송 종료에 실패했습니다.',
      type: 'destructive',
    })
    console.error("이송 종료 처리 실패", error)
    }
  }


  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{formData.patientIsUser ? '보호자 알림 전송' : '이송 종료'}</DialogTitle>
          </DialogHeader>
          {/*유저인 경우만 메세지 내용 노출*/}
          {formData.patientIsUser && formData.patientProtectorPhone &&  (
          <div className="space-y-4">
            <div className="bg-dialog_content p-4 rounded-lg">
              <p className="text-lg font-medium mb-4">
                [Safe Connect] {formData.patientName} 님의 이송 안내 드립니다.
              </p>
              <div className="space-y-2 text-lg text-black">
                {/*추후 수정!!*/}
                <p>▪️ 이송 병원: {formData.hospitalName}</p>
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
          )}
          {/*유저가 아니고 보호자번호가 없는 경우 바로 이송 종료*/}
          {(!formData.patientIsUser || !formData.patientProtectorPhone)&& (
              <div className="bg-dialog_content p-4 rounded-lg">
                <p className="text-lg">이송을 종료하시겠습니까?</p>
              </div>
          )}
          <div className="flex justify-end gap-4 mt-2">
            <Button variant="blue" onClick={handleCompelete}>
              {formData.patientIsUser && formData.patientProtectorPhone ? '전송 및 종료' : '이송 종료'}
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