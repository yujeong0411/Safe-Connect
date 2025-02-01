// src/pages/ControlPage/EmergencyDetailPage.tsx
import React from 'react';
import Button from '@components/atoms/Button/Button';

const EmergencyDetailPage = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6">
          {/* 제목 */}
          <h1 className="text-2xl font-bold mb-6">신고 상세정보</h1>

          {/* 상세 정보 테이블 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-500">성명</label>
              <p className="font-medium">홍길동</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">신고자</label>
              <p className="font-medium">김신고</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">나이</label>
              <p className="font-medium">45세</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">연락처</label>
              <p className="font-medium">010-0000-0000</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">신고 시각</label>
              <p className="font-medium">2024.01.17 14:30</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">신고 위치</label>
              <p className="font-medium">광주광역시 광산구 장덕동 1442</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">현재 상태</label>
              <p className="font-medium">구급대원 출동 중</p>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="gray" onClick={() => window.history.back()}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDetailPage;
