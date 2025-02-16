import React from 'react';
import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
import { useVideoCallStore } from '@/store/control/videoCallStore';
import VideoSessionUI from '@features/openvidu/component/VideoSessionUI.tsx';
import {controlService} from "@features/control/services/controlApiService.ts";
import {usePatientStore} from "@/store/control/patientStore.tsx";
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import {useLocationStore} from "@/store/location/locationStore.tsx";

import useRecorderStore from '@/store/openvidu/MediaRecorderStore.tsx';

interface VideoProps {
  children: React.ReactNode;
}

const VideoCallDrawer = ({ children }: VideoProps) => {
  const { isOpen, setIsOpen } = useVideoCallStore();
  const {fetchCallSummary} = usePatientStore()
  const { callId,leaveSession } = useOpenViduStore();
  const setIsLoading = useLocationStore((state) => state.setIsLoading);
  const setLocation = useLocationStore((state) => state.setLocation);
  const { stopRecording } = useRecorderStore();


  const handleEndCall = async () => { 
    if (!callId) {
      console.log("callId가 없습니다.")
      return
    }

    if (!window.confirm('정말로 전화를 종료하시겠습니까?')) {
      return;
    }

    try {
      await controlService.endCall(callId)
      await leaveSession()

      // 위치정보 초기화 및 로딩 상태 변경
      setLocation(37.566826, 126.9786567)  // 서울시청 좌표로 초기화
      setIsLoading(true)

      alert('신고가 종료되었습니다.')
      setIsOpen(false);  // Drawer 닫기
    } catch (error) {
      console.error("신고 종료 실패", error);
    }
  }


  // URL 재전송
  const handleResendUrl = async () => {
    if (!callId) {
      console.log("callId가 없습니다.")
      return
    }
    try {
      await controlService.resendUrl(callId);
      alert("URL이 재전송되었습니다.");
    } catch (error) {
      console.error("URL 재전송 실패", error);
    }
  }

  // 신고내용 요약
  const handleCallSummary = async () => {
  
    try {
      const audioBlob:Blob = await stopRecording();
    
    if (!audioBlob) {
      throw new Error('녹음된 오디오가 없습니다.');
    }

    if (!callId) {
      throw new Error('callId가 없습니다.');
    }

    // fetchCallSummary에 저장 로직 있음.
    await fetchCallSummary(Number(callId), audioBlob);
      alert('AI 요약이 완료되었습니다.');
    } catch (error) {
      console.error("신고내용 요약 실패", error);
      alert('AI 요약 중 오류가 발생했습니다.');
    }
  }

  return (
    <div className="flex w-full h-full">
      {/* 왼쪽 패널 - top 위치를 헤더 높이만큼 내림 */}
      <div
        className={`
          left-0 h-full bg-bg overflow-y-auto z-50
          transform transition-all duration-300 ease-in-out
          top-50
          ${isOpen ? 'w-1/2' : 'w-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* 상단 헤더 - 고정 */}
          <div className="p-6 pb-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">전화 업무</h2>
              <div className="space-x-4">
              <Button variant="destructive" size="default" onClick={handleEndCall}>
                전화 종료
              </Button>
                {/*<Button variant="default" size="default" onClick={handleResendUrl}>*/}
                {/*  URL 재전송*/}
                {/*</Button>*/}
                <Button variant="default" size="default" onClick={handleResendUrl}>
                  URL 재전송
                </Button>
                <Button onClick={handleCallSummary} variant="default" size="default" className="bg-banner hover:bg-[#404b5c]">
                  AI 요약
                </Button>
              <Button variant="outline" size="default" onClick={() => setIsOpen(false)}>
                닫기
              </Button>
            </div>
            </div>
          </div>

          <div className="flex flex-col h-[calc(100%-80px)]">
            {' '}
            {/* 헤더 높이를 제외한 나머지 */}
            {/* 영상통화 화면 - 고정 */}
            <div className="p-6 pb-2">
              <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center">
                <VideoSessionUI />
              </div>
            </div>
            {/* 신고 내용 입력 */}
            <div className="space-y-4 p-6">
              <div className="flex justify-end space-x-4">
                {/*<h3 className="text-lg font-semibold">신고 내용</h3>*/}
                <Button variant="default" size="default" onClick={handleResendUrl}>
                  URL 재전송
                </Button>
                <Button onClick={handleCallSummary} variant="default" size="default" className="bg-banner hover:bg-[#404b5c]">
                  AI 요약
                </Button>
              </div>
              {/*<Textarea*/}
              {/*  value={formData.callSummary}*/}
              {/*  onChange={(e) => updateFormData({ callSummary: e.target.value})}*/}
              {/*  placeholder="AI요약을 누르면 자동으로 요약됩니다."*/}
              {/*  readOnly  // 읽기 전용*/}
              {/*  className="p-4 min-h-[120px] bg-white"*/}
              {/*/>*/}
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
        <div className="w-full h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default VideoCallDrawer;
