// src/pages/ControlPage/DispatchPage.tsx
import React from 'react';
import Button from '@components/atoms/Button/Button';

const DispatchPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* 좌측: 영상통화 및 환자 정보 */}
        <div className="w-1/3 p-4">
          <div className="bg-gray-200 h-[300px] mb-4">
            <img src="/patient-video.png" alt="Video call" className="w-full h-full object-cover" />
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-bold mb-2">신고 내용</h3>
            <div className="space-y-2 text-sm">
              <p>위치: 광주광역시 광산구 장덕동 1442</p>
              <p>환자: 김환자</p>
              <p>상태: 구급대원 출동 중</p>
              <p>AI 요약: 긴급시 심정지 의심, 구급차 출동 필요</p>
            </div>
          </div>
        </div>

        {/* 우측: 지도 및 출동 지령 */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg p-6 shadow">
            {/* 지도 영역 (추후 카카오맵 API 적용) */}
            <div className="bg-gray-200 h-[400px] mb-4">
              <img src="/map-placeholder.png" alt="Map" className="w-full h-full object-cover" />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button variant="red">출동 지령</Button>
                <Button variant="gray">취소</Button>
              </div>
              <span className="text-sm text-gray-500">
                가장 가까운 구급차: 광산 1팀 (2분 거리)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchPage;