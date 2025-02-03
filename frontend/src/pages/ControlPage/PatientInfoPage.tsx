import MainTemplate from '@components/templates/MainTemplate';
import Input from '@components/atoms/Input/Input';
import Button from '@components/atoms/Button/Button';
import {useControlAuthStore} from "@/store/control/controlAuthStore.tsx";

const PatientInfoPage = () => {
  const {logout} = useControlAuthStore();
  const navItems = [
    { label: '영상통화 생성', path: '/Control/main' },
    { label: '신고 접수', path: '/Control/patient-info' },
    { label: '출동 지령', path: '/Control/dispatch' },
    { label: '보호자 알림', path: '/Control/main' },
    { label: '신고 목록', path: '/Control/logs' },
  ];

  const mainContent = (
    <div className="flex w-full h-[calc(100vh-120px)]">
      {/* 좌측: 영상통화 영역 */}
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
          <div className="absolute top-4 right-4 space-x-2">
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">URL 복사</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
              응급상황 종료
            </button>
          </div>
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

      {/* 우측: 환자 정보 입력 폼 */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg p-6 h-full">
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="환자 전화번호"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <Button variant="blue" className="ml-4">
              조회
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <Input className="w-full" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <Input className="w-full" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
              <Input className="w-full" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <Input className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">증상</label>
              <Input className="w-full" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">보호자 연락처</label>
              <Input className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">현재 병력</label>
              <Input className="w-full" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">복용 약물</label>
              <Input className="w-full" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">요약본</label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="요청사항을 입력하세요"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="blue">저장</Button>
          </div>
        </div>
      </div>
    </div>
  );

  return <MainTemplate navItems={navItems} logoutDirect={logout}>{mainContent}</MainTemplate>;
};

export default PatientInfoPage;
