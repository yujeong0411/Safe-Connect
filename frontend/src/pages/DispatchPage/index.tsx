import { useState } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import DispatchTable from '@/components/molecules/DispatchTable/DispatchTable';
import TransferDetailDialog from '@/features/dispatch/components/TransferDetailDialog';
import { useDispatchData } from '@/features/dispatch/hooks/useDispatchData';
import { DispatchData } from '@/features/dispatch/types/types';

const DispatchPage = () => {
  const [selectedDispatch, setSelectedDispatch] = useState<DispatchData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, totalPages, loading } = useDispatchData(currentPage);

  return (
    <DispatchMainTemplate logoutDirect={() => Promise.resolve()}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">출동 현황</h1>
        {loading ? (
          <div>로딩중...</div>
        ) : (
          <DispatchTable
            data={data}
            onRowClick={setSelectedDispatch}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
          />
        )}
        {selectedDispatch && (
          <TransferDetailDialog
            open={!!selectedDispatch}
            onClose={() => setSelectedDispatch(null)}
            data={selectedDispatch}
          />
        )}
      </div>
    </DispatchMainTemplate>
  );
};

export default DispatchPage;
