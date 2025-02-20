import React, {useEffect, useState, useMemo} from 'react';
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
import {useCallListStore} from '@/store/control/callListStore.tsx';
import {CallRecord} from '@/types/control/ControlRecord.types.ts';
import {format} from 'date-fns';
import { useVideoCallStore } from '@/store/control/videoCallStore';

const CallRecordForm = () => {
  const [isCallDetailOpen, setIsCallDetailOpen] = React.useState(false);
  const {callList, callDetail, fetchCallList, fetchCallDetail} = useCallListStore();
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션
  const [is24HourFilter, setIs24HourFilter] = useState(false);
  const {isOpen} = useVideoCallStore();

  useEffect(() => {
    fetchCallList();
  }, []);

  const columns = [
    // {key: 'callId', header: '신고 번호'},
    {key: 'callStartedAt', header: '신고 일시', render:(data: CallRecord) => format(new Date(data.callStartedAt), 'yyyy-MM-dd HH:mm:ss')},
    {key: 'callFinishedAt', header: '신고 종료 일시',  render: (data: CallRecord) => data.callFinishedAt
          ? format(new Date(data.callFinishedAt), 'yyyy-MM-dd HH:mm:ss')
          : '-'},
    {key: 'callIsDispatched', header: '출동 여부'},
    {key: 'callSummary', header: '신고 요약', render:(data: CallRecord) => {
      if (!data.callSummary) return '-';
      // 첫번째 줄만 추출 및 길이제한
        const firstLine = data.callSummary.split('.')[0];
        return firstLine.length > 6 ? `${firstLine.slice(0, 6)}...` : firstLine;
      }},
  ];

  // 24시간 이내 필터링
  // 신고는 자동으로 시간순으로 쌓인다.
  const filteredCallList = useMemo(() => {
    let processedList = [...callList]; // 원본 배열을 복사

    if (is24HourFilter) {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      processedList = processedList.filter(call => {
        const callTime = new Date(call.callStartedAt)
        return callTime >= twentyFourHoursAgo;
      });
    }

    // 가장 최근 시간이 먼저 오도록 역순 정렬
    return processedList.sort((a, b) =>
        new Date(b.callStartedAt).getTime() - new Date(a.callStartedAt).getTime()
    );
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
      <div className={`w-full p-2 sm:px-8 ${isOpen ? 'px-1 sm:px-2' : ''}`}>
        <div className="space-y-2">
          <div className="rounded-lg min-h-[20rem] md:min-h-[35rem]">
            <div className="flex justify-end items-center mb-2">
              <div className="flex items-center">
                <span className="text-sm md:text-md text-gray-900">24시간 이내</span>
                <input
                    type="checkbox"
                    checked={is24HourFilter}
                    onChange={() => setIs24HourFilter(!is24HourFilter)}
                    className="ml-2 w-3 h-3 md:w-4 md:h-4"
                />
              </div>
            </div>

            <div className="bg-white rounded-sm overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-200 hover:bg-gray-200">
                    {columns.map((column) => (
                        <TableHead
                            key={column.key}
                            className={`
                      text-gray-700 font-semibold text-center 
                      ${isOpen ? 'px-1 py-1 text-xs md:px-1 md:py-1 md:text-sm' : 'px-2 py-2 text-sm md:px-6 md:py-2 md:text-base'}
                      uppercase tracking-wider
                    `}
                        >
                          {column.header}
                        </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                      currentItems.map((data) => (
                          <TableRow
                              key={data.callId}
                              onClick={() => handleRowClick(data)}
                              className="hover:bg-pink-100 cursor-pointer transition-colors"
                          >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    className={`
                      text-gray-700 text-center 
                      ${isOpen ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-md'}
                      uppercase tracking-wider
                    `}
                                >
                                  {column.render
                                      ? column.render(data)
                                      : column.key === 'callIsDispatched'
                                          ? data[column.key]
                                              ? '출동'
                                              : '미출동'
                                          : data[column.key as keyof CallRecord]}
                                </TableCell>
                            ))}
                          </TableRow>
                      ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="text-center text-gray-500 py-2">
                          데이터가 없습니다.
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

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
      </div>)
}
  export default CallRecordForm;
