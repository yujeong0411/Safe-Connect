import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore';
import { controlService } from '@features/control/services/controlApiService.ts';
import { useLocationStore } from '@/store/location/locationStore.tsx';

interface VideoEndDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoEndDialog = ({ open, onOpenChange }: VideoEndDialogProps) => {
  const { leaveSession,callId } = useOpenViduStore();

  const handleConfirm = async () => {
    if (!callId) {
      return
    }
    try {
      await controlService.endCall(callId)
      await leaveSession()

      const locationStore = useLocationStore.getState();
      locationStore.setIsEmergencyCall(false);  // 신고 상태 해제
      locationStore.fetchUserLocation(); // 새로 추가된 함수 사용
      // Drawer 닫기
      onOpenChange(false);
    } catch (error) {
      console.error("신고 종료 실패", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>출동 지령이 완료되었습니다</AlertDialogTitle>
        <AlertDialogDescription>
          이제 신고자와의 통화를 종료하시겠습니까?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={handleConfirm}>
          통화 종료하기
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
);
};

export default VideoEndDialog;