// HospitalList.tsx
import { Hospital } from '../types/hospital.types';
import DispatchButton from './DispatchButton/DispatchButton';

interface HospitalListProps {
  hospitals: Hospital[];
  searchRadius: number;
  onSearch: () => void;
  isSearching?: boolean;
  selectedHospitalId?: number;
  onHospitalSelect?: (hospitalId: number) => void;
}

const HospitalList = ({
  hospitals,
  searchRadius,
  onSearch,
  isSearching,
  selectedHospitalId,
  onHospitalSelect
}: HospitalListProps) => {
  return (
    <div className="absolute right-4 top-4 bottom-4 w-96 bg-white/70 rounded-lg overflow-hidden shadow-xl z-10">
      {/* 헤더 섹션 */}
      <div className="sticky top-0 bg-white/70 shadow-sm p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">인근 응급실 목록</h2>
          {isSearching && (
            <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse">
              {searchRadius}km 탐색중
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <DispatchButton
            variant="blue"
            size="md"
            width="auto"
            onClick={onSearch}
            className="flex-1 shadow-sm hover:shadow-md transition-shadow"
          >
            {isSearching ? '검색 중지' : '검색 시작'}
          </DispatchButton>
        </div>
      </div>

      {/* 목록 섹션 */}
      <div className="p-4 overflow-y-auto max-h-[calc(100%-130px)] bg-gray-50/50">
        {isSearching && hospitals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-600">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600 mb-3"></div>
            <p className="font-medium mb-1">주변 병원을 검색하고 있습니다</p>
            <p className="text-sm text-gray-500">
              {searchRadius}km 반경 검색 중
            </p>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg mb-2">검색된 병원이 없습니다</p>
            <p className="text-sm">검색 버튼을 눌러 주변 병원을 검색하세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {hospitals.map((hospital) => (
              <div
                key={hospital.hospitalId}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  hospital.requested 
                    ? 'bg-gray-100 border-gray-200' 
                    : selectedHospitalId === hospital.hospitalId
                    ? 'bg-blue-50 border-blue-300 shadow-md'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => onHospitalSelect?.(hospital.hospitalId)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      {hospital.hospitalName}
                      {hospital.requested && (
                        <span className="text-gray-500 text-sm bg-gray-100 px-2 py-0.5 rounded-full">
                          요청됨
                        </span>
                      )}
                    </h3>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full flex-shrink-0 ${
                    hospital.distance <= 1
                      ? 'bg-green-100 text-green-800'
                      : hospital.distance <= 2
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {hospital.distance.toFixed(1)}km
                  </span>
                </div>

                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">수용가능 인원</span>
                    <span className={`text-sm font-medium ${
                      hospital.hospitalCapacity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {hospital.hospitalCapacity}명
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">예상 도착 시간</span>
                    <span className="text-sm font-medium text-gray-800">
                    약 {hospital.eta}분
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 pt-1">
                    <p className="truncate">{hospital.hospitalAddress}</p>
                    <p className="mt-1">{hospital.hospitalPhone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalList;