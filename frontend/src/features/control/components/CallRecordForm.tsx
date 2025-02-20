import React, {useEffect, useState, useMemo} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table.tsx';
import { Input } from '@/components/ui/input';
import Pagination from '@components/atoms/Pagination/Pagination.tsx';
import CallDetailDialog from '@features/control/components/CallDetailDialog.tsx';
import {useCallListStore} from '@/store/control/callListStore.tsx';
import {CallRecord} from '@/types/control/ControlRecord.types.ts';
import {format} from 'date-fns';
import { useVideoCallStore } from '@/store/control/videoCallStore';

const CallRecordForm = () => {
  const [isCallDetailOpen, setIsCallDetailOpen] = React.useState(false);
  const {callList, callDetail, fetchCallList, fetchCallDetail} = useCallListStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [phoneSearch, setPhoneSearch] = useState('');
  const {isOpen} = useVideoCallStore();
  const [dispatchFilter, setDispatchFilter] = useState<string | null>(null);  // null은 전체 선택을 의미


  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');  // 숫자만 추출

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  // 전화번호 검색 입력 핸들러
  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneSearch(formattedNumber);
  };

  useEffect(() => {
    fetchCallList();
  }, []);

  const columns = [
    {
      key: 'callStartedAt',
      header: '신고 일시',
      render: (data: CallRecord) => format(new Date(data.callStartedAt), 'yyyy-MM-dd HH:mm:ss')
    },
    {
      key: 'callerPhone',
      header: '신고자 연락처',
      render: (data: CallRecord) => {
        return data.caller.callerPhone ? formatPhoneNumber(data.caller.callerPhone) : '-';
      }
    },
    {
      key: 'callFinishedAt',
      header: '신고 종료 일시',
      render: (data: CallRecord) => data.callFinishedAt
        ? format(new Date(data.callFinishedAt), 'yyyy-MM-dd HH:mm:ss')
        : '-'
    },
    {
      key: 'callIsDispatched',
      header: '출동 여부'
    },
    {
      key: 'callSummary',
      header: '신고 요약',
      render: (data: CallRecord) => {
        if (!data.callSummary) return '-';
        const firstLine = data.callSummary.split('.')[0];
        return firstLine.length > 6 ? `${firstLine.slice(0, 6)}...` : firstLine;
      }
    },
  ];

  // 필터링된 리스트
  const filteredCallList = useMemo(() => {
    let processedList = [...callList];

    // 전화번호 검색
    if (phoneSearch) {
      const cleanedSearch = phoneSearch.replace(/\D/g, '');
      processedList = processedList.filter(call =>
        call.caller.callerPhone ? call.caller.callerPhone.replace(/\D/g, '').includes(cleanedSearch) : false
      );
    }

    // 출동 여부 필터 추가
    if (dispatchFilter !== null) {
      processedList = processedList.filter(call =>
        dispatchFilter === 'true' ? call.callIsDispatched : !call.callIsDispatched
      );
    }

    // 가장 최근 시간이 먼저 오도록 역순 정렬
    return processedList.sort((a, b) =>
      new Date(b.callStartedAt).getTime() - new Date(a.callStartedAt).getTime()
    );
  }, [callList, phoneSearch, dispatchFilter]);

  // 행 클릭 핸들러
  const handleRowClick = async (data: CallRecord) => {
    try {
      await fetchCallDetail(data.callId);
      setIsCallDetailOpen(true);
    } catch (error) {
      console.error('상세조회 실패', error);
    }
  };

  // 페이지네이션 설정
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCallList.length / itemsPerPage);

  // 현재 페이지 데이터
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCallList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCallList, currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const resetFilter = ()=>{
    setDispatchFilter(null);
    setPhoneSearch("")
    setCurrentPage(1);
  }

  // 필터나 검색어 변경시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [ phoneSearch, dispatchFilter]);

  return (
    <div className={`w-full p-5 sm:px-20 ${isOpen ? 'px-1 sm:px-2' : ''}`}>
      <div className="space-y-2">
        <div className="rounded-lg min-h-[20rem] md:min-h-[35rem]">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="mt-1 text-sm text-gray-500">
                총 {filteredCallList.length}건의 신고 기록이 있습니다.
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={dispatchFilter ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setDispatchFilter(value === '' ? null : value);
                }}
                className="w-28 px-3 py-3 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="true">출동</option>
                <option value="false">미출동</option>
              </select>
              <Input
                type="text"
                placeholder="전화번호 검색"
                value={phoneSearch}
                onChange={handlePhoneSearch}
                className="w-48 bg-white"
                maxLength={13}
              />

              <button onClick={resetFilter} className="px-4 py-1 rounded-md border bg-red-600 text-white">
                초기화
              </button>
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
                        ${isOpen ? 'px-1 py-1 text-xs md:px-2 md:py-2 md:text-sm' : 'px-2 py-2 text-sm md:px-6 md:py-2 md:text-base'}
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
                            ${isOpen ? 'px-3 py-3 text-sm' : 'px-4 py-4 text-md'}
                            uppercase tracking-wider
                          `}
                        >
                          {(() => {
                            if (column.render) {
                              return column.render(data);
                            }
                            if (column.key === 'callIsDispatched') {
                              return data[column.key] ? '출동' : '미출동';
                            }
                            return String(data[column.key as keyof CallRecord] ?? '-');
                          })()}
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
    </div>
  );
};

export default CallRecordForm;