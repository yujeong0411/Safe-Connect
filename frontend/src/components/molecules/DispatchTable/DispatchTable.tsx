import { format } from 'date-fns';
import { DispatchData } from '@/features/dispatch/types/types';
import Button from '@/components/atoms/Button/Button';
import Pagination from '@/components/atoms/Pagination/Pagination';

interface DispatchTableProps {
  data: DispatchData[];
  onRowClick: (data: DispatchData) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

const DispatchTable = ({
  data,
  onRowClick,
  currentPage,
  onPageChange,
  totalPages,
}: DispatchTableProps) => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">출동 현황</h2>
      </div>
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left">출동 지령 일시</th>
              <th className="px-4 py-3 text-left">이송 일자</th>
              <th className="px-4 py-3 text-left">이송 요청</th>
              <th className="px-4 py-3 text-left">이송 선정 일시</th>
              <th className="px-4 py-3 text-left">이송 종료 일시</th>
              <th className="px-4 py-3 text-left">구조 상세정보</th>
              <th className="px-4 py-3 text-left">환자 정보 작성</th>
              <th className="px-4 py-3 text-left">영상통화 연결</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index}
                onClick={() => onRowClick(row)}
                className={`cursor-pointer hover:bg-gray-50 ${
                  index === 0 ? 'bg-pink-50' : ''
                }`}
              >
                <td className="px-4 py-3">{format(new Date(row.requestTime), 'yyyy-MM-dd HH:mm')}</td>
                <td className="px-4 py-3">{row.patientName}</td>
                <td className="px-4 py-3">{row.transferDestination}</td>
                <td className="px-4 py-3">{row.requestHospital}</td>
                <td className="px-4 py-3">{row.transferCompleteTime}</td>
                <td className="px-4 py-3">
                  <Button variant="blue" size="sm">상세보기</Button>
                </td>
                <td className="px-4 py-3">
                  <Button variant="blue" size="sm">작성하기</Button>
                </td>
                <td className="px-4 py-3">
                  <Button variant="blue" size="sm">영상통화</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default DispatchTable;