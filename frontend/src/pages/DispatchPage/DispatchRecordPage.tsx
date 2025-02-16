import { useState, useEffect } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import DispatchRecordRow from '@/features/dispatch/components/DispatchRecordRow/DispatchRecordRow';
import Pagination from '@/components/atoms/Pagination/Pagination';
import { DispatchRecord } from '@/types/dispatch/dispatchRecord.types';
import { useTransferListStore } from '@/store/dispatch/transferListStore';
import DispatchDetailDialog from '@features/dispatch/components/TransferDetailDialog/DispatchDetailDialog.tsx';

const ITEMS_PER_PAGE = 10;

const DispatchRecordPage = () => {
  const [records, setRecords] = useState<DispatchRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const dispatchDetail = useTransferListStore((state) => state.dispatchDetail);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        await useTransferListStore.getState().fetchDispatchList();
        const dispatchRecords = useTransferListStore.getState().dispatchList;

        if (dispatchRecords) {
          setRecords(dispatchRecords);
          setTotalPages(Math.ceil(dispatchRecords.length / ITEMS_PER_PAGE));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('출동 기록 조회 실패:', error);
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // dispatchDetail이 변경되면 다이얼로그 열기
  useEffect(() => {
    if (dispatchDetail) {
      setIsDetailOpen(true);
    }
  }, [dispatchDetail]);

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

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
                <th scope="col" className="px-4 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider">
                  출동 시작 시간
                </th>
                <th scope="col" className="px-4 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider">
                  현장 도착 시간
                </th>
                <th scope="col" className="px-4 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider">
                  병원 이송 여부
                </th>
                <th scope="col" className="px-4 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이송 병원
                </th>
                <th scope="col" className="px-4 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이송 수락 시간
                </th>
                <th scope="col" className="px-4 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이송 완료 시간
                </th>
                <th scope="col" className="px-4 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상세 정보
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentPageData().map((record) => (
                <DispatchRecordRow key={record.dispatchId} record={record} />
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

        <DispatchDetailDialog
          open={isDetailOpen}
          onClose={handleCloseDetail}
          data={dispatchDetail || []} // null 체크만 하면 됨
        />
      </div>
    </DispatchMainTemplate>
  );
};

export default DispatchRecordPage;