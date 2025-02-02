import MainTemplate from '@components/templates/MainTemplate';
import Button from '@components/atoms/Button/Button';

const DispatchPage = () => {
  const navItems = [
    { label: '영상통화 생성', path: '/Control/main' },
    { label: '신고 접수', path: '/Control/patient-info' },
    { label: '출동 지령', path: '/Control/dispatch' },
    { label: '보호자 알림', path: '/Control/main' },
    { label: '신고 목록', path: '/Control/logs' },
  ];

  const mainContent = (
    <div className="flex w-full h-[calc(100vh-120px)]">
      {/* 좌측: 영상통화 및 신고내용 */}
      <div className="w-1/2 p-4 border-r border-gray-200">
        <div className="relative w-full h-[400px] bg-white rounded-lg overflow-hidden">
          <img
            src="/patient-video.png"
            alt="Emergency call video"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
            또는 대기화면
          </div>
          <button className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded text-sm">
            연결 종료
          </button>
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg">
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="신고 내용을 입력하세요"
          />
          <button className="w-32 mt-3 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
            AI 요약
          </button>
        </div>
      </div>

      {/* 우측: 지도 및 구급대 정보 */}
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="환자 진찰번호"
              className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <Button variant="blue" className="px-6">
              조회
            </Button>
          </div>

          <div className="h-[calc(100%-60px)] bg-gray-100 rounded-lg relative">
            {/* 여기에 카카오맵 구현 예정 */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <h4 className="font-medium text-red-500 mb-2">면남119 구급차량 목록</h4>
                <p className="text-sm text-gray-600">거리: 100m, 도착 예상 시간: 1분</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-md">
                <h4 className="font-medium text-blue-500">광산 응급 병원</h4>
                <p className="text-sm text-gray-600">거리: 800m, 도착 예상 시간: 9분</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <MainTemplate navItems={navItems}>{mainContent}</MainTemplate>;
};

export default DispatchPage;
