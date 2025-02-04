import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useVideoCallStore } from '@/store/control/videoCallStore';

interface VideoProps {
  children: React.ReactNode;
}

const VideoCallDrawer = ({ children }: VideoProps) => {
  const { isOpen, setIsOpen } = useVideoCallStore();
  const [reportContent, setReportContent] = React.useState('');

  return (
    <>
      {/* 왼쪽 패널 - top 위치를 헤더 높이만큼 내림 */}
      <div
        className={`
          fixed left-0 h-full bg-bg overflow-y-auto z-50
          transform transition-all duration-300 ease-in-out
          top-50
          ${isOpen ? 'w-1/2 translate-x-0' : 'w-0 -translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">영상 통화</h2>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              닫기
            </Button>
          </div>

          <div className="space-y-6 flex-1">
            {/* 영상통화 화면 */}
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              Video Call
            </div>

            {/* 신고 내용 입력 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">신고 내용</h3>
                <Button variant="default" size="sm" className="bg-banner hover:bg-[#404b5c]">
                  AI 요약
                </Button>
              </div>
              <Textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="신고 내용을 입력하세요..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 - 패널 상태에 따라 너비 조정 */}
      <div
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isOpen ? 'ml-[50%]' : 'ml-0'}
        `}
      >
        <div className="w-full">{children}</div>
      </div>
    </>
  );
};

export default VideoCallDrawer;
