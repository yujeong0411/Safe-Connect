import React, { useEffect, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table.tsx';
import Pagination from '@components/atoms/Pagination/Pagination.tsx';
import CallDetailDialog from '@features/control/components/CallDetailDialog.tsx';
import { useCallListStore } from '@/store/control/callListStore.tsx';
import { CallRecord } from '@/types/control/ControlRecord.types.ts';

const CallRecordForm = () => {
  const [isCallDetailOpen, setIsCallDetailOpen] = React.useState(false);
  const { callList, callDetail, fetchCallList, fetchCallDetail } = useCallListStore();
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션
  const [is24HourFilter, setIs24HourFilter] = useState(false);

  useEffect(() => {
    fetchCallList();
  }, []);

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log('현재 callList:', callList);
  }, [callList]);

  const columns = [
    { key: 'callStartedAt', header: '신고 일시' },
    { key: 'callFinishedAt', header: '신고 종료 일시' },
    { key: 'callIsDispatched', header: '출동 여부' },
    { key: 'callSummary', header: '신고 요약' },
  ];

  // 24시간 이내 필터링
  const filteredCallList = useMemo(() => {
    if (!is24HourFilter) return callList;

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours()-24);

    return callList.filter(call => {
      const callTime = new Date(call.callStartedAt)
      return callTime >= twentyFourHoursAgo;
    });
  }, [callList, is24HourFilter]);


  // 열 클릭 시 디테일 연결
  const handleRowClick = async (data: CallRecord) => {
    try {
      await fetchCallDetail(data.callId);
      setIsCallDetailOpen(true);
    } catch (error) {
      console.error('상세조회 실패', error);
    }
  };

  // 한 페이지당 항목 수
  const itemsPerPage = 10;

  // 전체 페이지 수 (전체 항목 수/한 페이지당 수)
  //const totalPages = Math.ceil(callList.length / itemsPerPage);
  const totalPages = Math.ceil(filteredCallList.length / itemsPerPage);

  // 현재 페이지의 데이터만 필터링
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCallList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCallList, currentPage]);

  // 페이지 변경
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 min-h-[42rem]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">신고 내역</h2>
            <div className="flex items-center">
              <span className="text-md text-gray-900">24시간 이내</span>
              <input type="checkbox" checked={is24HourFilter} onChange={() => setIs24HourFilter(!is24HourFilter)} className="ml-2 w-4 h-4" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/*현재 페이제 10개만 필터링*/}
              {currentItems.map((data) => (
                <TableRow
                  key={data.callId}
                  onClick={() => handleRowClick(data)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.key.includes('At')
                        ? new Date(data[column.key as keyof CallRecord]).toLocaleString()
                        : column.key === 'callIsDispatched'
                          ? data[column.key]
                            ? '출동'
                            : '미출동'
                          : data[column.key as keyof CallRecord]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-center gap-2 mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              siblingCount={1}
            />
          </div>
        </div>
      </div>

      <CallDetailDialog
        open={isCallDetailOpen}
        onOpenChange={setIsCallDetailOpen}
        data={callDetail}
      />
    </div>
  );
};

export default CallRecordForm;
