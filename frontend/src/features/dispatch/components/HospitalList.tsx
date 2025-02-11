import DispatchButton from './DispatchButton/DispatchButton';
import { Hospital } from '../types/hospital.types';
interface HospitalListProps {
  hospitals: Hospital[];
  searchRadius: number;
  onSearch: () => void;
  onIncreaseRadius: () => void;
  onDecreaseRadius: () => void;
  onBulkRequest: () => void;
}

const HospitalList = ({
  hospitals,
  searchRadius,
  onSearch,
  onIncreaseRadius,
  onDecreaseRadius,
  onBulkRequest
}: HospitalListProps) => {
  return (
    <div className="absolute right-4 top-4 bottom-4 w-96 bg-white/60 rounded-lg overflow-hidden shadow-lg z-10">
      <div className="sticky top-0 bg-white/90 p-4 border-b">
        <h2 className="text-xl font-bold mb-4">인근 응급실 목록</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2">
            <DispatchButton
              variant="gray"
              size="sm"
              width="auto"
              onClick={onDecreaseRadius}
            >
              -500m
            </DispatchButton>
            <span className="py-1">{searchRadius}m</span>
            <DispatchButton
              variant="gray"
              size="sm"
              width="auto"
              onClick={onIncreaseRadius}
            >
              +500m
            </DispatchButton>
          </div>
          <div className="flex gap-2">
            <DispatchButton
              variant="blue"
              size="sm"
              width="auto"
              onClick={onSearch}
            >
              검색
            </DispatchButton>
            <DispatchButton
              variant="blue"
              size="sm"
              width="auto"
              onClick={onBulkRequest}
            >
              일괄 전송
            </DispatchButton>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100%-140px)]">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className={`p-4 rounded-lg border mb-2 ${
              hospital.requested 
                ? 'bg-gray-100 cursor-not-allowed' 
                : 'bg-white hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">
                {hospital.place_name}
                {hospital.requested && <span className="text-gray-500 ml-2">(요청됨)</span>}
              </h3>
              <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {hospital.distance}km
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              예상 도착 시간: {Math.round(parseFloat(hospital.distance) * 2)}분
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalList;