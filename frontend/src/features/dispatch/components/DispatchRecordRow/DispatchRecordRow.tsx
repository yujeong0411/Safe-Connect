import { useState } from 'react';
import Button from '@/components/atoms/Button/Button';
import { DispatchRecord } from '../../types/dispatchRecord.types';
import TransferDetailDialog from '../TransferDetailDialog/TransferDetailDialog';

interface DispatchRecordRowProps {
  record: DispatchRecord;
}

const DispatchRecordRow = ({ record }: DispatchRecordRowProps) => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 text-sm">
        <td className="px-4 py-3 whitespace-nowrap">
          {record.dispatchResponsible}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          {record.dispatchStartTime}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          {record.dispatchEndTime}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${record.hasTransfer ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {record.hasTransfer ? '이송' : '미이송'}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          {record.hospitalName || '-'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          {record.transferStartTime || '-'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          {record.transferEndTime || '-'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-right">
          <Button
            variant="blue"
            size="sm"
            onClick={() => setShowDetailDialog(true)}
          >
            상세 정보
          </Button>
        </td>
      </tr>

      <TransferDetailDialog 
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        data={record.patientInfo}
      />
    </>
  );
};

export default DispatchRecordRow;