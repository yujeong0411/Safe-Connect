// src/pages/ControlPage/EmergencyLogPage.tsx
import React, { useState } from 'react';
import Input from '@components/atoms/Input/Input';
import Button from '@components/atoms/Button/Button';
import Pagination from '@components/atoms/Pagination/Pagination';

const EmergencyLogPage = () => {
  // 더미 데이터
  const dummyData = Array(10).fill(null).map((_, index) => ({
    id: `${index + 1}`,
    callTime: 'Cell Text',
    location: 'Cell Text',
    status: 'Cell Text',
    assignedTeam: 'Cell Text',
  }));

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-white p-6">
      {/* 상단 검색 영역 */}
      <div className="mb-6 flex items-end gap-4">
        <Input
          placeholder="신고 전화번호"
          width="quarter"
        />
        <Button variant="blue">
          조회
        </Button>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">신고 시간</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">위치</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상태</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">배정팀</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyData.map((row) => (
              <tr 
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => console.log('Row clicked:', row.id)}
              >
                <td className="px-4 py-3">{row.callTime}</td>
                <td className="px-4 py-3">{row.location}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">{row.assignedTeam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default EmergencyLogPage;