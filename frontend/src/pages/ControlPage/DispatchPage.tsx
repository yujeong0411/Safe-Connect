import { useState } from 'react';
import MainTemplate from '@/components/templates/MainTemplate';
import TextArea from '@/components/atoms/TextArea/TextArea';
import Button from '@/components/atoms/Button/Button';
import DispatchCommandDialog from '@/features/control/components/DispatchCommandDialog';

const DispatchPage = () => {
  const [reportContent, setReportContent] = useState('');
  const [isDispatchDialogOpen, setIsDispatchDialogOpen] = useState(false);
  
  const navItems = [
    { label: '영상통화 생성', path: '/Control/main' },
    { label: '신고 접수', path: '/Control/patient-info' },
    { label: '출동 지령', path: '/Control/dispatch' },
    { label: '보호자 알림', path: '/Control/main' },
    { label: '신고 목록', path: '/Control/logs' },
  ];

  return (
    <MainTemplate navItems={navItems}>
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* 왼쪽: 신고 내용 섹션 */}
        <div className="space-y-6">
          {/* 이미지 섹션 */}
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="/emergency-call-image.jpg" 
              alt="Emergency call"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 신고 내용 입력 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">신고 내용</h3>
            <TextArea
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              placeholder="신고 내용을 입력하세요..."
              className="min-h-[120px]"
            />
          </div>

          {/* AI 요약 섹션 */}
          <div className="space-y-2">
            <div className="bg-[#545f71] text-white p-2 rounded-md inline-block">
              AI 요약
            </div>
            <div className="p-4 bg-gray-100 rounded-lg min-h-[100px]">
              <p className="text-gray-600">AI가 요약한 내용이 표시됩니다.</p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 지도 섹션 */}
        <div className="space-y-4">
          {/* 검색 필터 */}
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="근처 소방서 목록"
              className="flex-1 p-2 border border-gray-300 rounded-md"
              readOnly
            />
            <Button variant="blue" size="md" width="auto">
              검색
            </Button>
          </div>

          {/* 지도 영역 */}
          <div className="bg-gray-100 rounded-lg relative" style={{ height: 'calc(100vh - 250px)' }}>
            <div className="w-full h-full rounded-lg overflow-hidden">
              {/* 지도 API가 로드될 div */}
              <div id="map" className="w-full h-full" />
              
              {/* 우측 하단 버튼 */}
              <div className="absolute bottom-4 right-4">
                <Button 
                  variant="red" 
                  size="lg" 
                  width="auto"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => setIsDispatchDialogOpen(true)}
                >
                  출동 지령
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DispatchCommandDialog 
        open={isDispatchDialogOpen}
        onOpenChange={setIsDispatchDialogOpen}
      />
    </MainTemplate>
  );
};

export default DispatchPage;