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

const CallRecordForm = () => {
  const [isCallDetailOpen, setIsCallDetailOpen] = React.useState(false);
  const {callList, callDetail, fetchCallList, fetchCallDetail} = useCallListStore();
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
    {key: 'callId', header: '신고 번호'},
    {key: 'callStartedAt', header: '신고 일시', render:(data: CallRecord) => format(new Date(data.callStartedAt), 'yyyy-MM-dd HH:mm:ss')},
    {key: 'callFinishedAt', header: '신고 종료 일시',  render: (data: CallRecord) => data.callFinishedAt
          ? format(new Date(data.callFinishedAt), 'yyyy-MM-dd HH:mm:ss')
          : '-'},
    {key: 'callIsDispatched', header: '출동 여부'},
    {key: 'callSummary', header: '신고 요약'},
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
      <div className="w-full p-10">
        <div className="space-y-6">
          <div className="rounded-lg min-h-[42rem]">
            <div className="flex justify-end items-center mb-4">
              <div className="flex items-center">
                <span className="text-md text-gray-900">24시간 이내</span>
                <input
                    type="checkbox"
                    checked={is24HourFilter}
                    onChange={() => setIs24HourFilter(!is24HourFilter)}
                    className="ml-2 w-4 h-4"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-200 hover:bg-gray-200">
                    {columns.map((column) => (
                        <TableHead
                            key={column.key}
                            className="text-gray-700 font-semibold text-center px-6 py-3 uppercase tracking-wider text-base"
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
                                    className="px-6 py-3 text-gray-700 text-center text-base"
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
                        <TableCell colSpan={columns.length} className="text-center text-gray-500 py-4">
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
