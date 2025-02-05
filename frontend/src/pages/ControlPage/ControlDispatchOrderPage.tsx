import { useState } from 'react';
import ControlMainTemplate from '@features/control/components/ControlMainTemplate.tsx';
import Button from '@/components/atoms/Button/Button';
import DispatchCommandDialog from '@/features/control/components/DispatchCommandDialog';
import KakaoMap from '@features/control/components/KakaoMap.tsx';
import {FireStation} from "@features/control/types/kakaoMap.types.ts";
import {DispatchGroup} from "@/types/dispatch/dispatchGroup.types.ts";
import {useDispatchGroupStore} from "@/store/dispatch/dispatchGroupStore.tsx";

const ControlDispatchOrderPage = () => {
  const [isDispatchDialogOpen, setIsDispatchDialogOpen] = useState(false);
  const [fireStations, setFireStations] = useState<FireStation[]>([]);
  const {fetchDispatchGroups, selectedStation, setSelectedStation, dispatchGroups} = useDispatchGroupStore();

  // 예상 시간 계산 (카카오 제공 안함.)
  const calculatedEstimatedTime = (distanceInMeters: string) => {
    const distance = parseInt(distanceInMeters);
    const speedInMetersPerMinute = (60 * 1000) / 60  // 60km/h로 가정, m/min 변환
    return Math.round(distance / speedInMetersPerMinute)
  }

  const handleStationClick = (stationName: string) => {
    setSelectedStation(selectedStation === stationName ? null : stationName);
    fetchDispatchGroups()
  }

  return (
    <ControlMainTemplate>
      <div className="relative h-screen">
        {/* Map Section - Full Width */}
        <div className="absolute inset-0">
          <KakaoMap FindFireStations={setFireStations} />
        </div>

        {/* 소방서 목록 패널 */}
        <div className="absolute right-4 top-4 bottom-4 w-96 bg-white/60 rounded-lg overflow-y-auto z-10 hide-scrollbar">
          <div className="sticky top-0 bg-white/60 p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">인근 소방서 목록</h2>
              <Button
                variant="red"
                size="md"
                width="auto"
                className="bg-red-500 hover:bg-red-600"
                onClick={() => setIsDispatchDialogOpen(true)}
              >
                출동 지령
              </Button>
            </div>
            </div>

          {/* 스크롤되는 목록 */}
          <div className="p-4">
            {fireStations.map((station) => (
              <div  key={station.place_name}
                    onClick={() => handleStationClick(station.place_name)}
                    className="p-4 mb-4 bg-rose-30 rounded-lg border border-rose-200 cursor-pointer">
                <h3 className="font-semibold">{station.place_name}</h3>
                <div className="mt-2 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>거리</span>
                    <span className="font-medium">{station.distance}km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>도착 예상 시간</span>
                    <span className="font-medium">
                      {calculatedEstimatedTime(station.distance)}분
                    </span>
                  </div>
                </div>

                {selectedStation === station.place_name && (
                    <div className="mt-4 pl-4 border-l-2">
                      <h4 className="font-medium mb-2">소방팀 목록</h4>
                      {dispatchGroups.map((group) => (
                          <div key={group.dispatchGroupId} className="text-sm p-2 bg-white/50 rounded mb-2">
                            소방팀 ID: {group.dispatchGroupId}
                          </div>
                      ))}
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <DispatchCommandDialog open={isDispatchDialogOpen} onOpenChange={setIsDispatchDialogOpen} />
    </ControlMainTemplate>
  );
};

export default ControlDispatchOrderPage;
