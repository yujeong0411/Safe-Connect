import { Button } from '@/components/ui/button';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore';
import { useLocationStore } from "@/store/location/locationStore";
import VideoSessionUI from '@features/openvidu/component/VideoSessionUI.tsx';
import {useDispatchPatientStore} from "@/store/dispatch/dispatchPatientStore.tsx";
import {completeVideo} from "@features/dispatch/sevices/dispatchServiece.ts";

interface VideoCallDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallDrawer = ({ isOpen, onClose }: VideoCallDrawerProps) => {
  const { dispatchLeaveSession } = useOpenViduStore();
  const setIsLoading = useLocationStore((state) => state.setIsLoading);
  const {formData} = useDispatchPatientStore()

  const handleEndCall = async () => {
    if (!formData.dispatchId) {
      return;
    }

    if (!window.confirm('정말로 전화를 종료하시겠습니까?')) {
      return;
    }

    try {
      await completeVideo(formData.dispatchId);
      await dispatchLeaveSession();
      setIsLoading(true);
      alert('현장에 도착하였습니다.');
      onClose();  // drawer 닫기
    } catch (error) {
      console.error("통화 종료 실패", error);
    }
  };


  return (
    <div
      className={`
        fixed left-0 h-full bg-bg overflow-y-auto z-40
        transform transition-all duration-300 ease-in-out
        top-[150px]
        ${isOpen ? 'w-1/2' : 'w-0'}
      `}
    >
      <div className="h-full flex flex-col">
        {/* 상단 헤더 */}
        <div className="p-6 pb-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">전화 업무</h2>
            <div className="space-x-4">
              <Button variant="destructive" size="default" onClick={handleEndCall}>
                전화 종료
              </Button>
              <Button variant="outline" size="default" onClick={onClose}>
                닫기
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100%-100px)]">
          {/* 영상통화 화면 */}
          <div className="p-6 pb-2">
            <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center">
              <VideoSessionUI />
            </div>
          </div>
          {/* 신고 내용 입력 */}
          <div className="space-y-4 p-6">
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallDrawer;