import Button from '@/components/atoms/Button/Button';
import EmergencyLogItem from '@/components/molecules/EmergencyLogItem/EmergencyLogItem';

const EmergencyLogs = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">신고접수 목록</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-600">24시간 이내</span>
          <input type="checkbox" className="ml-2 accent-[#545f71]" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100">
        <span className="text-sm font-semibold">신고 일시</span>
        <span className="text-sm font-semibold">신고 출동 일시</span>
        <span className="text-sm font-semibold">출동 일시</span>
        <span className="text-sm font-semibold">위험 유무</span>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        <EmergencyLogItem
          time="2024-02-03 14:30"
          dispatchTime="2024-02-03 14:35"
          arrivalTime="2024-02-03 14:45"
          status="위험"
        />
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <Button variant="gray" size="sm" width="auto">이전</Button>
        {[1, 2, 3, 4, 5].map((page) => (
          <Button
            key={page}
            variant={page === 1 ? 'blue' : 'gray'}
            size="sm"
            width="auto"
          >
            {page}
          </Button>
        ))}
        <Button variant="gray" size="sm" width="auto">다음</Button>
      </div>
    </div>
  );
};

export default EmergencyLogs;