// DispatchRecordRow.tsx
import React from 'react';
import { format } from 'date-fns';
import { TableCell, TableRow } from '@/components/ui/table';
import { DispatchRecord } from '@/types/dispatch/dispatchRecord.types';

interface DispatchRecordRowProps {
  record: DispatchRecord;
  onDetailClick: (record: DispatchRecord) => void;
}

const DispatchRecordRow: React.FC<DispatchRecordRowProps> = ({
                                                               record,
                                                               onDetailClick
                                                             }) => {
  const formatDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return '-';
    return format(new Date(dateTimeStr), 'yyyy-MM-dd HH:mm:ss');
  };

  const formatPhoneNumber = (phoneNumber: string | null): string => {
    if (!phoneNumber) return '-';
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phoneNumber;
  };

  const cellClassName = "text-gray-600 text-center px-3 py-3 text-sm whitespace-nowrap";

  return (
    <TableRow
      className="hover:bg-pink-100 cursor-pointer transition-colors"
      onClick={() => onDetailClick(record)}
    >
      <TableCell className={cellClassName}>
        {formatDateTime(record.dispatchCreatedAt)}
      </TableCell>
      <TableCell className={cellClassName}>
        {formatDateTime(record.dispatchArriveAt)}
      </TableCell>
      <TableCell className={cellClassName}>
        {formatPhoneNumber(record.callerPhone)}
      </TableCell>
      <TableCell className={cellClassName}>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  record.dispatchIsTransfer
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {record.dispatchIsTransfer ? '이송' : '현장조치 완료'}
                </span>
      </TableCell>
      <TableCell className={cellClassName}>
        {record.transfer ? record.transfer.hospital.hospitalName : '-'}
      </TableCell>
      <TableCell className={cellClassName}>
        {record.transfer ? formatDateTime(record.transfer.transferAcceptAt) : '-'}
      </TableCell>
      <TableCell className={cellClassName}>
        {record.transfer ? formatDateTime(record.transfer.transferArriveAt) : '-'}
      </TableCell>
    </TableRow>
  );
};

export default DispatchRecordRow;