import { useState } from 'react';
import { Hospital } from '../types/hospital.types';
import DispatchButton from './DispatchButton/DispatchButton';
import { useHospitalSSE } from '@/hooks/useHospitalSSE';
import { NotificationToast } from '@/components/organisms/NotificationToast/NotificationToast';

interface HospitalListProps {
  hospitals: Hospital[];
  selectedHospital: string | null;
  onSelectHospital: (hospitalName: string | null) => void;
  onBulkRequest: () => void;
}

const HospitalList = ({
  hospitals,
  selectedHospital,
  onSelectHospital,
  onBulkRequest
}: HospitalListProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const notifications = useHospitalSSE(isRequesting);
  const [showNotifications, setShowNotifications] = useState<string[]>([]);

  const handleBulkRequest = () => {
    setIsRequesting(true);
    onBulkRequest();
  };

  const removeNotification = (timestamp: string) => {
    setShowNotifications(prev => [...prev, timestamp]);
  };

  return (
    <>
      {/* 알림 토스트 영역 */}
      <div className="fixed top-4 right-4 w-96 z-50">
        {notifications
          .filter(notification => !showNotifications.includes(notification.timestamp))
          .slice(-3)
          .map((notification) => (
            <NotificationToast
              key={notification.timestamp}
              notification={notification}
              onClose={() => removeNotification(notification.timestamp)}
            />
          ))}
      </div>

      {/* 기존 HospitalList UI */}
      <div className="absolute right-4 top-4 bottom-4 w-96 bg-white/60 rounded-lg overflow-y-auto z-10 hide-scrollbar">
        <div className="sticky top-0 bg-white/60 p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">인근 응급실 목록</h2>
            <DispatchButton
              variant="blue"
              size="md"
              width="auto"
              onClick={handleBulkRequest}
              disabled={!selectedHospital || isRequesting}
            >
              일괄 요청
            </DispatchButton>
          </div>
        </div>

        <div className="p-4">
          {[...hospitals]
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
            .map((hospital) => (
              <div
                key={hospital.place_name}
                className={`p-4 mb-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedHospital === hospital.place_name
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white/60 border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onSelectHospital(
                  selectedHospital === hospital.place_name ? null : hospital.place_name
                )}
              >
                <h3 className="font-semibold">{hospital.place_name}</h3>
                <div className="mt-2 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>거리</span>
                    <span className="font-medium">{hospital.distance}km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>도착 예상 시간</span>
                    <span className="font-medium">
                      {Math.round(parseFloat(hospital.distance) * 2)}분
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default HospitalList;