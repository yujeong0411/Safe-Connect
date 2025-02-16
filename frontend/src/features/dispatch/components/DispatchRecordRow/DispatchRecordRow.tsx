import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DispatchRecord } from '@/types/dispatch/dispatchRecord.types';
import { useTransferListStore } from '@/store/dispatch/transferListStore';

interface DispatchRecordRowProps {
  record: DispatchRecord;
}

const DispatchRecordRow: React.FC<DispatchRecordRowProps> = ({ record }) => {
  const fetchDispatchDetail = useTransferListStore((state) => state.fetchDispatchDetail);

  const handleDetailClick = () => {
    fetchDispatchDetail(record.dispatchId);
  };

  const formatDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return '-';
    return format(new Date(dateTimeStr), 'yyyy-MM-dd HH:mm:ss');
  };

  return (
    <tr>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        {record.dispatchId}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDateTime(record.dispatchCreatedAt)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDateTime(record.dispatchArriveAt)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {record.transfer ? formatDateTime(record.transfer.transferAcceptAt) : '-'}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {record.transfer ? record.transfer.hospital.hospitalName : '-'}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {record.transfer ? formatDateTime(record.transfer.transferArriveAt) : '-'}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            record.dispatchIsTransfer
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {record.dispatchIsTransfer ? '이송 완료' : '진행 중'}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button
          variant="ghost"
          className="text-indigo-600 hover:text-indigo-900"
          onClick={handleDetailClick}
        >
          상세보기
        </Button>
      </td>
    </tr>
  );
};

export default DispatchRecordRow;