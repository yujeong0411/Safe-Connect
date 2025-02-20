// DispatchRecordPage.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import DispatchRecordRow from '@/features/dispatch/components/DispatchRecordRow/DispatchRecordRow';
import Pagination from '@/components/atoms/Pagination/Pagination';
import { DispatchRecord } from '@/types/dispatch/dispatchRecord.types';
import { useTransferListStore } from '@/store/dispatch/transferListStore';
import DispatchDetailDialog from '@features/dispatch/components/TransferDialog/DispatchDetailDialog.tsx';

const ITEMS_PER_PAGE = 10;

const TABLE_HEADERS = [
  { key: 'dispatchCreatedAt', label: '출동 시작 시간' },
  { key: 'dispatchArriveAt', label: '현장 도착 시간' },
  { key: 'callerPhone', label: '신고자 연락처' },
  { key: 'dispatchIsTransfer', label: '병원 이송 여부' },
  { key: 'hospitalName', label: '이송 병원' },
  { key: 'transferAcceptAt', label: '이송 수락 시간' },
  { key: 'transferArriveAt', label: '이송 완료 시간' },
];

const DispatchRecordPage = () => {
  const [records, setRecords] = useState<DispatchRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [is24HourFilter, setIs24HourFilter] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [hospitalSearch, setHospitalSearch] = useState('');

  const dispatchDetail = useTransferListStore((state) => state.dispatchDetail);
  const fetchDispatchDetail = useTransferListStore((state) => state.fetchDispatchDetail);

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneSearch(formattedNumber);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        await useTransferListStore.getState().fetchDispatchList();
        const dispatchRecords = useTransferListStore.getState().dispatchList;
        if (dispatchRecords) {
          setRecords(dispatchRecords);
        }
      } catch (error) {
        console.error('출동 기록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    if (dispatchDetail) {
      setIsDetailOpen(true);
    }
  }, [dispatchDetail]);

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleDetailClick = (record: DispatchRecord) => {
    fetchDispatchDetail(record.dispatchId);
  };

  const filteredRecords = useMemo(() => {
    let processedList = [...records];

    if (is24HourFilter) {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      processedList = processedList.filter(record => {
        const dispatchTime = new Date(record.dispatchCreatedAt);
        return dispatchTime >= twentyFourHoursAgo;
      });
    }

    // 전화번호 검색
    if (phoneSearch) {
      const cleanedSearch = phoneSearch.replace(/\D/g, '');
      processedList = processedList.filter(record =>
        record.call?.caller?.callerPhone?.replace(/\D/g, '')?.includes(cleanedSearch)
      );
    }

    // 병원명 검색
    if (hospitalSearch) {
      processedList = processedList.filter(record =>
        record.transfer?.hospital?.hospitalName
          ?.toLowerCase()
          .includes(hospitalSearch.toLowerCase())
      );
    }

    return processedList.sort((a, b) =>
      new Date(b.dispatchCreatedAt).getTime() - new Date(a.dispatchCreatedAt).getTime()
    );
  }, [records, is24HourFilter, phoneSearch, hospitalSearch]);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const totalPages = useMemo(() =>
      Math.ceil(filteredRecords.length / ITEMS_PER_PAGE),
    [filteredRecords]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [is24HourFilter, phoneSearch, hospitalSearch]);

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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-3 mt-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <p className="mt-1 text-sm text-gray-500">
              총 {filteredRecords.length}건의 출동 기록이 있습니다.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              type="text"
              placeholder="전화번호 검색"
              value={phoneSearch}
              onChange={handlePhoneSearch}
              className="w-48"
              maxLength={13}
            />
            <Input
              type="text"
              placeholder="병원명 검색"
              value={hospitalSearch}
              onChange={(e) => setHospitalSearch(e.target.value)}
              className="w-48"
            />
            <label className="flex items-center cursor-pointer">
              <span className="text-md text-gray-900 mr-2">24시간 이내</span>
              <input
                type="checkbox"
                checked={is24HourFilter}
                onChange={() => setIs24HourFilter(!is24HourFilter)}
                className="ml-2 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-sm overflow-x-auto mb-8 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200 hover:bg-gray-200">
                {TABLE_HEADERS.map((header) => (
                  <TableHead
                    key={header.key}
                    className="text-gray-700 font-semibold text-center px-6 md:px-8 lg:px-10 py-3 text-sm md:text-base uppercase tracking-wider whitespace-nowrap"
                  >
                    {header.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.length > 0 ? (
                currentPageData.map((record) => (
                  <DispatchRecordRow
                    key={record.dispatchId}
                    record={record}
                    onDetailClick={handleDetailClick}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={TABLE_HEADERS.length}
                    className="text-center text-gray-500 py-6"
                  >
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            siblingCount={1}
          />
        </div>

        <DispatchDetailDialog
          open={isDetailOpen}
          onClose={handleCloseDetail}
          data={dispatchDetail || []}
        />
      </div>
    </DispatchMainTemplate>
  );
};

export default DispatchRecordPage;