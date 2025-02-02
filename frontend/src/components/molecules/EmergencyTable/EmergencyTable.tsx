import Badge from '@components/atoms/Badge/Badge';

interface EmergencyRecord {
  id: string;
  date: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  location: string;
}

interface EmergencyTableProps {
  data: EmergencyRecord[];
  onRowClick: (id: string) => void;
}

const EmergencyTable = ({ data, onRowClick }: EmergencyTableProps) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">신고 일시</th>
          <th className="p-2 text-left">신고자</th>
          <th className="p-2 text-left">상태</th>
          <th className="p-2 text-left">위치</th>
        </tr>
      </thead>
      <tbody>
        {data.map((record) => (
          <tr
            key={record.id}
            className="border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => onRowClick(record.id)}
          >
            <td className="p-2">{record.date}</td>
            <td className="p-2">{record.name}</td>
            <td className="p-2">
              <Badge status={record.status} />
            </td>
            <td className="p-2">{record.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmergencyTable;
