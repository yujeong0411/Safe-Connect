// src/features/dispatch/pages/DispatchRecordPage.tsx

import { useState, useEffect } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import DispatchRecordRow from '@/features/dispatch/components/DispatchRecordRow/DispatchRecordRow';
import Pagination from '@/components/atoms/Pagination/Pagination';
import { DispatchRecord } from '@/features/dispatch/types/dispatchRecord.types';

const ITEMS_PER_PAGE = 10;

const DispatchRecordPage = () => {
  const [records, setRecords] = useState<DispatchRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // TODO: API 연동
        const mockData: DispatchRecord[] = Array.from({ length: 23 }, (_, index) => ({
          id: String(index + 1),
          dispatchResponsible: `구급대원 ${index + 1}`,
          dispatchStartTime: '2024-02-13 14:30:00',
          dispatchEndTime: '2024-02-13 15:45:00',
          hasTransfer: index % 3 !== 0,
          hospitalName: index % 3 !== 0 ? '서울대병원' : null,
          transferStartTime: index % 3 !== 0 ? '2024-02-13 15:00:00' : null,
          transferEndTime: index % 3 !== 0 ? '2024-02-13 15:45:00' : null,
          patientInfo: {
            name: `환자${index + 1}`,
            gender: '남',
            age: '45',
            patientContact: '010-1234-5678',
            guardianContact: '010-8765-4321',
            consciousness: '명료',
            preKTAS: '2',
            sbp: '120',
            dbp: '80',
            pr: '88',
            bt: '36.5',
            spo2: '98',
            bst: '110',
            medicalHistory: '고혈압',
            medications: '혈압약',
            reportSummary: '갑자기 가슴 통증을 호소',
            symptoms: '흉통, 호흡곤란'
          }
        }));

        setRecords(mockData);
        setTotalPages(Math.ceil(mockData.length / ITEMS_PER_PAGE));
        setIsLoading(false);
      } catch (error) {
        console.error('출동 기록 조회 실패:', error);
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return records.slice(startIndex, endIndex);
  };

  if (isLoading) {
    return (
      <DispatchMainTemplate>
        <div className="flex justify-center items-center h-full">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </DispatchMainTemplate>
    );
  }

  return (
    <DispatchMainTemplate>
      <div className="p-8 max-w-[90rem] mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">출동 기록</h2>
          <p className="mt-1 text-sm text-gray-500">
            총 {records.length}건의 출동 기록이 있습니다.
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    출동 담당자
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    출동 시작 일시
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    출동 종료 일시
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이송 유무
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이송 병원
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이송 시작 일시
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이송 종료 일시
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상세 정보
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentPageData().map((record) => (
                  <DispatchRecordRow key={record.id} record={record} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              siblingCount={1}
            />
          </div>
        </div>
      </div>
    </DispatchMainTemplate>
  );
};

export default DispatchRecordPage;