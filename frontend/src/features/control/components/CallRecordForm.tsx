import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table.tsx';
import { Button } from '@components/ui/button.tsx';
import CallDetailDialog from '@features/control/components/CallDetailDialog.tsx';
import { useCallListStore } from '@/store/control/callListStore.tsx';
import { CallRecord } from '@/types/control/ControlRecord.types.ts';

const CallRecordForm = () => {
  const [isCallDetailOpen, setIsCallDetailOpen] = React.useState(false);
  const { callList, callDetail, fetchCallList, fetchCallDetail } = useCallListStore();

  useEffect(() => {
    fetchCallList();
  }, []);

  const columns = [
    { key: 'CallStartedAt', header: '신고 일시' },
    { key: 'CallFinishedAt', header: '신고 종료 일시' },
    { key: 'IsDispatch', header: '출동 여부' },
    { key: 'CallSummary', header: '신고 요약' },
  ];

  const handleRowClick = async (data: CallRecord) => {
    try {
      await fetchCallDetail(data.callId);
      setIsCallDetailOpen(true);
    } catch (error) {
      console.error('상세조회 실패', error);
    }
  };

  // 상세 조회 API 테스트
  const testDetailAPI = async () => {
    try {
      await fetchCallDetail(1); // store의 함수 사용
      setIsCallDetailOpen(true);
    } catch (error) {
      console.error('상세 조회 실패:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">신고접수 목록</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">24시간 이내</span>
              <input type="checkbox" className="ml-2" />
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
              {callList.map((data) => (
                <TableRow
                  key={data.callId}
                  onClick={() => handleRowClick(data)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {data[(column.key as keyof CallRecord) || '-']}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline">이전</Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button key={page} variant={page === 1 ? 'default' : 'outline'}>
                {page}
              </Button>
            ))}
            <Button variant="outline">다음</Button>
          </div>
        </div>
      </div>
      {/* API 테스트 버튼 */}
      <Button onClick={testDetailAPI} className="mb-4">
        상세 조회 API 테스트 (ID: 1)
      </Button>

      <CallDetailDialog
        open={isCallDetailOpen}
        onOpenChange={setIsCallDetailOpen}
        data={callDetail}
      />
    </div>
  );
};

export default CallRecordForm;
