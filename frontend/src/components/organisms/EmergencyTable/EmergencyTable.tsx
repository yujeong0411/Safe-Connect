// src/components/organisms/EmergencyTable/EmergencyTable.tsx
import StatusBadge from '@components/atoms/StatusBadge/StatusBadge';
import Button from '@components/atoms/Button/Button';

interface EmergencyData {
  id: string;
  status: 'waiting' | 'in_progress' | 'completed';
  time: string;
  location: string;
  patientName: string;
  team: string;
  hospital: string;
}

interface EmergencyTableProps {
  data: EmergencyData[];
  onActionClick: (id: string) => void;
}

const EmergencyTable = ({ data, onActionClick }: EmergencyTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-8 gap-4 p-4 bg-gray-50 font-semibold text-sm">
        <div>상태</div>
        <div>접수시간</div>
        <div className="col-span-2">위치</div>
        <div>환자명</div>
        <div>구급대</div>
        <div>이송병원</div>
        <div>조치</div>
      </div>

      <div className="divide-y">
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-8 gap-4 p-4 items-center text-sm">
            <div>
              <StatusBadge status={item.status} />
            </div>
            <div>{item.time}</div>
            <div className="col-span-2 truncate">{item.location}</div>
            <div>{item.patientName}</div>
            <div>{item.team}</div>
            <div>{item.hospital}</div>
            <div>
              <Button variant="blue" size="sm" onClick={() => onActionClick(item.id)}>
                상세보기
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyTable;
