// src/features/dispatch/components/HospitalList.tsx
import { Hospital } from '../types/hospital.types';
import DispatchButton from './DispatchButton/DispatchButton';

interface HospitalListProps {
  hospitals: Hospital[];
  searchRadius: number;
  onSearch: () => void;
  onBulkRequest: () => void;
  isSearching?: boolean;
}


const HospitalList = ({
  hospitals,
  searchRadius,
  onSearch,
  onBulkRequest,
  isSearching
}: HospitalListProps) => {
  return (
    <div className="absolute right-4 top-4 bottom-4 w-96 bg-white/95 rounded-lg overflow-hidden shadow-xl z-10">
      {/* 헤더 섹션 */}
      <div className="sticky top-0 bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">인근 응급실 목록</h2>
          {isSearching && (
            <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse">
              {(searchRadius / 1000).toFixed(1)}km 탐색중
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <DispatchButton
            variant="blue"
            size="md"
            width="auto"
            onClick={onSearch}
            disabled={isSearching}
            className="flex-1 shadow-sm hover:shadow-md transition-shadow"
          >
            {isSearching ? '검색 중...' : '검색 시작'}
          </DispatchButton>
          <DispatchButton
            variant="blue"
            size="md"
            width="auto"
            onClick={onBulkRequest}
            disabled={isSearching || hospitals.length === 0}
            className="flex-1 shadow-sm hover:shadow-md transition-shadow"
          >
            일괄 전송 ({hospitals.length})
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
              {(searchRadius / 1000).toFixed(1)}km 반경 검색 중
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
                key={hospital.id}
                className={`p-4 rounded-lg border transition-all ${
                  hospital.requested 
                    ? 'bg-gray-100 border-gray-200' 
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">
                    {hospital.place_name}
                    {hospital.requested && (
                      <span className="text-gray-500 text-sm ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                        요청됨
                      </span>
                    )}
                  </h3>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    parseFloat(hospital.distance) <= 1
                      ? 'bg-green-100 text-green-800'
                      : parseFloat(hospital.distance) <= 2
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {hospital.distance}km
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  예상 도착 시간: {Math.round(parseFloat(hospital.distance) * 2)}분
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalList;