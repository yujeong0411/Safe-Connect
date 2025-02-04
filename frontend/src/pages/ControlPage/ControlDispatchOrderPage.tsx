import { useState } from 'react';
import ControlMainTemplate from '@features/control/components/ControlMainTemplate.tsx';
import Button from '@/components/atoms/Button/Button';
import DispatchCommandDialog from '@/features/control/components/DispatchCommandDialog';
import KakaoMap from '@features/control/components/KakaoMap.tsx';

const ControlDispatchOrderPage = () => {
  const [isDispatchDialogOpen, setIsDispatchDialogOpen] = useState(false);

  return (
    <ControlMainTemplate>
      <div className="relative h-screen">
        {/* Map Section - Full Width */}
        <div className="absolute inset-0">
          <KakaoMap />
        </div>

        {/* Hospital List Section - Floating Panel */}
        <div className="absolute right-4 top-4 bottom-4 w-96 bg-white/60 rounded-lg overflow-y-auto z-10">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">인근 소방서 목록</h2>

            <div className="p-4 mb-4 bg-rose-30 rounded-lg border border-rose-200">
              <h3 className="font-semibold">하남 종합 병원</h3>
              <div className="mt-2 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>거리</span>
                  <span className="font-medium">700m</span>
                </div>
                <div className="flex justify-between">
                  <span>도착 예상 시간</span>
                  <span className="font-medium">4분</span>
                </div>
              </div>
            </div>

            <div className="p-4 mb-4 rounded-lg border border-gray-200 bg-white/50">
              <h3 className="font-semibold">광산 종합 병원</h3>
              <div className="mt-2 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>거리</span>
                  <span className="font-medium">1000m</span>
                </div>
                <div className="flex justify-between">
                  <span>도착 예상 시간</span>
                  <span className="font-medium">11분</span>
                </div>
              </div>
              {/* 우측 하단 버튼 */}
              <div className="absolute bottom-4 right-4">
                <Button
                  variant="red"
                  size="md"
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
        <DispatchCommandDialog open={isDispatchDialogOpen} onOpenChange={setIsDispatchDialogOpen} />
      </div>
    </ControlMainTemplate>
  );
};

export default ControlDispatchOrderPage;
