import React, {useState} from 'react';
import { Button } from '@/components/ui/button';
import { useVideoCallStore } from '@/store/control/videoCallStore';
import VideoSessionUI from '@features/openvidu/component/VideoSessionUI.tsx';
import {controlService} from "@features/control/services/controlApiService.ts";
import {usePatientStore} from "@/store/control/patientStore.tsx";
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import {useLocationStore} from "@/store/location/locationStore.tsx";
import ConfirmDialog from '@components/organisms/ConfirmDialog/ConfirmDialog.tsx';
import { Alert, AlertTitle, AlertDescription } from '@components/ui/alert.tsx';
import { CircleCheckBig, CircleAlert } from 'lucide-react';

import useRecorderStore from '@/store/openvidu/MediaRecorderStore.tsx';

interface VideoProps {
  children: React.ReactNode;
}

const VideoCallDrawer = ({ children }: VideoProps) => {
  const { isOpen, setIsOpen } = useVideoCallStore();
  const {fetchCallSummary} = usePatientStore()
  const { callId,leaveSession } = useOpenViduStore();
  const { stopRecording } = useRecorderStore();
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive' | 'info' | 'warning' | 'success',
  });

  // 알림창 표시 핸들러
  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  const handleEndCall = async () => { 
    if (!callId) {
      handleAlertClose({
        title: '신고 없음',
        description: '현재 신고가 없습니다.',
        type: 'destructive',
      });
      return
    }

    try {
      await controlService.endCall(callId)
      await leaveSession()

      const locationStore = useLocationStore.getState();
      locationStore.setIsEmergencyCall(false);  // 신고 상태 해제
      locationStore.fetchUserLocation(); // 새로 추가된 함수 사용

      // alert('신고가 종료되었습니다.')
      handleAlertClose({
        title: '신고 종료',
        description: '현재 신고가 종료되었습니다.',
        type: 'default',
      });

      setIsOpen(false);  // Drawer 닫기
    } catch (error) {
      console.error("신고 종료 실패", error);
    }
  }


  // URL 재전송
  const handleResendUrl = async () => {
    if (!callId) {
      handleAlertClose({
        title: '신고 없음',
        description: '현재 신고가 없습니다.',
        type: 'destructive',
      });
      return
    }
    try {
      await controlService.resendUrl(callId);
      handleAlertClose({
        title: 'URL 재전송',
        description: 'URL이 재전송되었습니다.',
        type: 'default',
      });
    } catch (error) {
      console.error("URL 재전송 실패", error);
      handleAlertClose({
        title: 'URL 재전송 실패',
        description: 'URL이 재전송에 실패하였습니다.',
        type: 'destructive',
      });
    }
  }

  // 신고내용 요약
  const handleCallSummary = async () => {
    console.log("handleCallSummary 실행");
    try {
      const audioBlob:Blob = await stopRecording();

    if (!callId) {
      handleAlertClose({
        title: '신고 없음',
        description: '현재 신고가 없습니다.',
        type: 'destructive',
      });
      return;
    }

    if (!audioBlob) {
      handleAlertClose({
        title: '오디오 없음',
        description: '현재 녹음된 오디오가 없습니다.',
        type: 'destructive',
      });
      return;
    }


    // fetchCallSummary에 저장 로직 있음.
    await fetchCallSummary(Number(callId), audioBlob);
      // alert('AI 요약이 완료되었습니다.');
      handleAlertClose({
        title: 'AI 요약 성공',
        description: 'AI 요약에 성공하였습니다.',
        type: 'default',
      });
    } catch (error) {
      console.error("신고내용 요약 실패", error);
      // alert('AI 요약 중 오류가 발생했습니다.');
      handleAlertClose({
        title: 'AI 요약 실패',
        description: 'AI 요약에 실패하였습니다.',
        type: 'destructive',
      });
    }
  }

  return (
    <div className="flex w-full h-screen">
      {/* 왼쪽 패널 - top 위치를 헤더 높이만큼 내림 */}
      <div
        className={`
          left-0 bg-bg overflow-y-auto z-50
          transform transition-all duration-300 ease-in-out
          top-12
          ${isOpen ? 'w-1/2' : 'w-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* 상단 헤더 - 고정 */}
          <div className="p-6 pb-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">영상 통화</h2>
              <div className="space-x-4">
                <ConfirmDialog
                  trigger="상황 종료"
                  title="상황 종료"
                  description="신고가 종료됐습니까?"
                  confirmText="완료"
                  triggerVariant="destructive"
                  cancelVariant="gray"
                  confirmVariant="destructive"
                  onConfirm={handleEndCall}
                />
                <Button variant="default" size="default" onClick={handleResendUrl}>
                  URL 재전송
                </Button>
                <Button
                  onClick={handleCallSummary}
                  variant="default"
                  size="default"
                  className="bg-banner hover:bg-[#404b5c]"
                >
                  AI 요약
                </Button>
                <Button variant="outline" size="default" onClick={() => setIsOpen(false)}>
                  닫기
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="p-6">
              <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center">
                <VideoSessionUI />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 - 패널 상태에 따라 너비 조정 */}
      <div
        className={`
        transition-all duration-300 ease-in-out
          ${isOpen ? 'w-1/2' : 'w-full'}
        `}
      >
        <div className="w-full overflow-y-auto">{children}</div>
      </div>

      {showAlert && (
        <div className="fixed left-1/2 top-80 -translate-x-1/2 z-[999]">
          <Alert variant={alertConfig.type} className="w-[400px] shadow-lg bg-white">
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
    </div>
  );
};

export default VideoCallDrawer;
