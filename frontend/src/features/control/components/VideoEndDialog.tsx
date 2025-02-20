import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleCheckBig, CircleAlert } from 'lucide-react';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore';
import { controlService } from '@features/control/services/controlApiService.ts';
import { useLocationStore } from '@/store/location/locationStore.tsx';
import { usePatientStore } from '@/store/control/patientStore.tsx';
import {useVideoCallStore} from "@/store/control/videoCallStore.ts";
import { useState } from 'react';

interface VideoEndDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoEndDialog = ({ open, onOpenChange }: VideoEndDialogProps) => {
  const { leaveSession,callId } = useOpenViduStore();
  const { sendProtectorMessage, patientInfo, currentCall} = usePatientStore();
  const { setIsOpen } = useVideoCallStore();
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

  const handleSendMessage = async () => {
    if (currentCall?.userId && patientInfo?.userPhone) {
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


  const handleConfirm = async () => {
    if (!callId) {
      return
    }
    try {
      // 보호자 알림 시도
      if (currentCall?.userId && patientInfo?.userProtectorPhone) {
        await handleSendMessage()
      }

      await controlService.endCall(callId)
      await leaveSession()

      const locationStore = useLocationStore.getState();
      locationStore.setIsEmergencyCall(false);  // 신고 상태 해제
      locationStore.fetchUserLocation(); // 새로 추가된 함수 사용
      // 비디오 닫기
      setIsOpen(false);

      // Drawer 닫기
      onOpenChange(false);
    } catch (error) {
      console.error("신고 종료 실패", error);
    }
  };

  return (
      <>
    <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>출동 지령이 완료되었습니다</AlertDialogTitle>
        <AlertDialogDescription>
          이제 신고자와의 통화를 종료하시겠습니까?
          {currentCall?.userId && patientInfo?.userProtectorPhone && (
              <div className="mt-2 text-sm text-gray-500">
                * 통화 종료 시 보호자에게 자동으로 알림이 전송됩니다.
              </div>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={handleConfirm}>
          통화 종료하기
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>

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
                <AlertDescription className="text-base m-2">
                  {alertConfig.description}
                </AlertDescription>
              </Alert>
            </div>
        )}
      </>
);
};

export default VideoEndDialog;