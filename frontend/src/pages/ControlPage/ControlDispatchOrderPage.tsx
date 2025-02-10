import { useState } from 'react';
import ControlMainTemplate from '@features/control/components/ControlMainTemplate.tsx';
import Button from '@/components/atoms/Button/Button';
import KakaoMap from '@features/control/components/KakaoMap.tsx';
import { Alert, AlertTitle, AlertDescription } from '@components/ui/alert.tsx';
import {CircleAlert, CircleCheckBig} from 'lucide-react';
import { FireStation } from '@features/control/types/kakaoMap.types.ts';
import { useDispatchGroupStore } from '@/store/dispatch/dispatchGroupStore.tsx';
import {usePatientStore} from "@/store/control/patientStore.tsx";
import {orderDispatch} from "@features/control/services/controlApiService.ts";

const ControlDispatchOrderPage = () => {
  // const [isDispatchDialogOpen, setIsDispatchDialogOpen] = useState(false);
  const [fireStations, setFireStations] = useState<FireStation[]>([]);
  const {currentCall} = usePatientStore();
  const { selectedStation, setSelectedStation, dispatchGroups } = useDispatchGroupStore();
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null); // 단일 소방팀 선택
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' |'destructive',
  });


  // 3초 후 사라지는 로직
  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  // 출동지령 알림창
  const handleDispatchAlert = async () => {
    if (!selectedTeam) {
      handleAlertClose({
        title: '소방팀 미선택',
        description: '소방팀을 선택해주세요.',
        type: 'destructive',
      });
      return;
    }

    // 테스트 동안 제거
    // if (!currentCall?.callId) {
    //   handleAlertClose({
    //     title:"신고 정보 없음",
    //     description: "현재 처리 중인 신고가 없습니다.",
    //     type: 'destructive',
    //   })
    //   return
    // }

    try {
      // currentCall.callId 대신 undefined 전달 - orderDispatch 함수에서 mockCallId 사용
      await orderDispatch(selectedTeam);
      // await orderDispatch(selectedTeam, currentCall.callId);
      handleAlertClose({
        title: '출동 지령 전송',
        description: '출동 지령이 전송되었습니다.',
        type: 'default',
      });
      setSelectedTeam(null);
      setSelectedStation(null);
    } catch (error) {
      handleAlertClose({
        title: '출동 지령 실패',
        description: '출동 지령 전송에 실패했습니다.',
        type: 'destructive',
      });
    }
  };

  // 예상 시간 계산 (카카오 제공 안함.)
  const calculatedEstimatedTime = (distanceInMeters: string) => {
    const distance = parseInt(distanceInMeters);
    const speedInMetersPerMinute = (60 * 1000) / 60; // 60km/h로 가정, m/min 변환
    return Math.round(distance / speedInMetersPerMinute);
  };

  // 소방팀 선택 처리
  const handleSelectTeam = (dispatchGroupId: number) => {
    setSelectedTeam(selectedTeam === dispatchGroupId ? null : dispatchGroupId); // 토글 동작 유지
  };

  return (
    <ControlMainTemplate>
      <div className="relative h-screen">
        {showAlert && (
            <div className="fixed left-1/2 top-80 -translate-x-1/2  z-50 ">
              <Alert
                  variant={alertConfig.type}  // 조건문 제거, 직접 type 사용
                  className={`w-[400px] shadow-lg bg-white ${
                      alertConfig.type === 'default'
                          ? '[&>svg]:text-blue-600 text-blue-600'
                          : '[&>svg]:text-red-500 text-red-500'
                  }`}
              >
                {alertConfig.type === 'default' ? (
                    <CircleCheckBig className="h-6 w-6 " />
                ) : (
                    <CircleAlert className="h-6 w-6" />
                )}
                <AlertTitle className="text-lg ml-2">{alertConfig.title}</AlertTitle>
                <AlertDescription className="text-sm m-2">
                  {alertConfig.description}
                </AlertDescription>
              </Alert>
            </div>
        )}

        <div className="absolute inset-0">
          <KakaoMap FindFireStations={setFireStations} />
        </div>

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
                onClick={handleDispatchAlert}
              >
                출동 지령
              </Button>
            </div>
          </div>

          {/* 소방서 목록 */}
          <div className="p-4">
            {[...fireStations]
              // 거리순으로 정렬
              .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
              .map((station) => (
                <div
                  key={station.place_name}
                  onClick={() =>
                    setSelectedStation(
                      selectedStation === station.place_name ? null : station.place_name
                    )
                  }
                  className="p-4 mb-4 bg-rose-30 rounded-lg border border-rose-200 cursor-pointer"
                >
                  <h3 className="font-semibold">{station.place_name}</h3>
                  <div className="mt-2 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>거리</span>
                      <span className="font-medium">{station.distance}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>도착 예상 시간</span>
                      <span className="font-medium">
                        {calculatedEstimatedTime(station.distance)}분
                      </span>
                    </div>
                  </div>

                  {/*소방팀 목록*/}
                  {selectedStation === station.place_name && (
                    <div className="mt-4 pl-4 border-l-2">
                      {dispatchGroups.length === 0 ? (
                        <div className="text-sm text-gray-500">가용 가능한 소방팀이 없습니다.</div>
                      ) : (
                        dispatchGroups.map((group) => (
                          <div
                            key={group.dispatchGroupId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTeam(group.dispatchGroupId);
                            }}
                            className={`text-sm p-2 rounded mb-2 ${
                              selectedTeam === group.dispatchGroupId
                                ? 'bg-red-200 hover:bg-red-100'
                                : 'bg-gray-200/60 hover:bg-red-50'
                            }`}
                          >
                            소방 {group.dispatchGroupId}팀
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
      {/*selectedTeam={selectedTeam} 추가하기 */}
      {/*<DispatchOrderDialog open={isDispatchDialogOpen} onOpenChange={setIsDispatchDialogOpen} />*/}
    </ControlMainTemplate>
  );
};

export default ControlDispatchOrderPage;
