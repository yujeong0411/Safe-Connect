import  Button from '@/components/atoms/Button/Button';

interface HospitalSearchSectionProps {
  onSearch: (distance: number) => void;
}

const HospitalSearchSection = ({ onSearch }: HospitalSearchSectionProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">인근 응급실 목록</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span>하남 응급 병원</span>
          <div className="text-sm text-gray-500">
            거리: 300m | 도착 예상 시간: 5분
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>광산 응급 병원</span>
          <div className="text-sm text-gray-500">
            거리: 600m | 도착 예상 시간: 11분
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>하나 응급 병원</span>
          <div className="text-sm text-gray-500">
            거리: 1000m | 도착 예상 시간: 15분
          </div>
        </div>
      </div>
      <Button variant="blue" className="mt-4" onClick={() => onSearch(1000)}>
        일괄 요청
      </Button>
    </div>
  );
};

export default HospitalSearchSection;