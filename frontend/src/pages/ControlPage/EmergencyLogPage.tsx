// src/pages/ControlPage/EmergencyLogPage.tsx
import React, { useState } from 'react';
import MainTemplate from '@components/templates/MainTemplate';
import Input from '@components/atoms/Input/Input';
import Button from '@components/atoms/Button/Button';
import Pagination from '@components/atoms/Pagination/Pagination';

const EmergencyLogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const navItems = [
    { label: '영상통화 생성', path: '/Control/main' },
    { label: '신고 접수', path: '/Control/patient-info' },
    { label: '출동 지령', path: '/Control/dispatch' },
    { label: '보호자 알림', path: '/Control/main' },
    { label: '신고 목록', path: '/Control/logs' }
  ];

  // 더미 데이터
  const dummyData = Array(10).fill(null).map((_, index) => ({
    id: `${index + 1}`,
    date: '2024-01-31',
    time: '14:30:00',
    location: '광주광역시 동구 금남로 1가',
    status: index % 2 === 0 ? '출동 완료' : '출동 중',
    team: `구급${index + 1}팀`,
  }));

  const mainContent = (
    <div className="flex flex-col h-[calc(100vh-120px)] p-6">
      {/* 상단 검색 영역 */}
      <div className="mb-6 flex items-center gap-4">
        <Input
          placeholder="신고 전화번호"
          className="w-80"
        />
        <Button variant="blue">
          조회
        </Button>
      </div>

      {/* 테이블 컨테이너 */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">신고 일자</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">신고 시간</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">위치</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">상태</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">배정팀</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyData.map((row) => (
                <tr 
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => console.log('Row clicked:', row.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.time}</td>
                  <td className="px-6 py-4">{row.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      row.status === '출동 완료' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );

  return <MainTemplate navItems={navItems}>{mainContent}</MainTemplate>;
};

export default EmergencyLogPage;