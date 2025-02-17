import { useState } from 'react';
import ControlMainTemplate from '@features/control/components/ControlMainTemplate.tsx';
import Button from '@/components/atoms/Button/Button';
import KakaoMap from '@features/control/components/KakaoMap.tsx';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert.tsx';
import { CircleAlert, CircleCheckBig } from 'lucide-react';
import { FireStation } from '@features/control/types/kakaoMap.types.ts';
import { useDispatchGroupStore } from '@/store/dispatch/dispatchGroupStore.tsx';
import { orderDispatch } from '@features/control/services/controlApiService.ts';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import { usePatientStore } from '@/store/control/patientStore';
import { useNavigate } from 'react-router-dom';

const ControlDispatchOrderPage = () => {
  const [fireStations, setFireStations] = useState<FireStation[]>([]);
  const { selectedStation, setSelectedStation, dispatchGroups } = useDispatchGroupStore();
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null); // 단일 소방팀 선택
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive',
  })
  const navigate = useNavigate();
  const { callId, sessionId } = useOpenViduStore();
  const { currentCall } = usePatientStore.getState();

  const patientId = currentCall?.patientId;

  // 마커 클릭 시
  const handleMarkerClick = (station: FireStation) => {
    setSelectedStation(selectedStation === station.place_name ? null : station.place_name);
  };

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

    try {
      // 출동 지령 HTTP 요청 전송
      if (!patientId){
        handleAlertClose({
          title: '환자 정보가 없습니다.',
          description: '환자 정보를 저장해주세요.',
          type: 'default',
        });
        setTimeout(() => {
          navigate('/control/patient-info');
        }, 1500);
        return;
      }

      if (callId && patientId) {
        await orderDispatch(selectedTeam, callId, patientId, sessionId); // dispatchGroupId, callId, patientId
      }else{
        handleAlertClose({
          title: '신고가 없습니다.',
          description: '신고가 없어 출동지령을 못 보냅니다..',
          type: 'default',
        });
      }

      handleAlertClose({
        title: '출동 지령 전송',
        description: '출동 지령이 전송되었습니다.',
        type: 'default',
      });

      // 성공 후 상태 초기화
      setSelectedTeam(null);
      setSelectedStation(null);
    } catch (error) {
      handleAlertClose({
        title: '출동 지령 전송 실패',
        description: '출동 지령 전송에 실패했습니다.',
        type: 'destructive',
      });
    }
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
              variant={alertConfig.type} // 조건문 제거, 직접 type 사용
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
              <AlertDescription className="text-sm m-2">{alertConfig.description}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="absolute inset-0">
          <KakaoMap
            FindFireStations={setFireStations}
            onMarkerClick={handleMarkerClick}
            selectedStation={selectedStation}
          />
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
                  onClick={() => handleMarkerClick(station)}
                  className="p-4 mb-4 bg-rose-30 rounded-lg border border-rose-200 cursor-pointer"
                >
                  <h3 className="font-semibold">{station.place_name}</h3>
                  <div className="mt-2 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>거리</span>
                      <span className="font-medium">{station.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>도착 예상 시간</span>
                      <span className="font-medium">{station.eta}</span>
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
      {/*삭제 */}
      {/*<DispatchOrderDialog open={isDispatchDialogOpen} onOpenChange={setIsDispatchDialogOpen} />*/}
    </ControlMainTemplate>
  );
};

export default ControlDispatchOrderPage;
