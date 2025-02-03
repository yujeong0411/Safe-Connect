import Button from '@components/atoms/Button/Button';
import Input from '@components/atoms/Input/Input';

const GuardianNotificationPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6">보호자 알림 전송</h2>

        <div className="space-y-6">
          {/* 메시지 미리보기 */}
          <div>
            <h3 className="text-lg font-medium mb-2">메세지</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">[Safe Connect] 응급 신고 접수 알림</p>
              <p className="mt-2">[000]님의 119 신고가 접수되었습니다.</p>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• 신고 시각: 2024.01.17 14:30</li>
                <li>• 신고 위치: 광주광역시 광산구 장덕동 1442</li>
                <li>• 현재 상태: 구급대원 출동 중</li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                * 환자의 위치로 이동 중이신 경우, 안전운전 바랍니다.
              </p>
            </div>
          </div>

          {/* 보호자 연락처 입력 */}
          <div>
            <Input label="보호자 연락처" width="full" placeholder="010-0000-0000" />
          </div>

          {/* 버튼 */}
          <div className="flex justify-between gap-4">
            <Button variant="gray" className="flex-1">
              취소
            </Button>
            <Button variant="blue" className="flex-1">
              전송
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianNotificationPage;
