// src/pages/ControlPage/ControlMainPage.tsx
import React, { useState } from 'react';
import NavBar from '@components/organisms/NavBar/NavBar';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader';
import VideoCallDialog from '@components/organisms/VideoCallDialog/VideoCallDialog';
import controlMain from '@/assets/image/controlmain.png';

const ControlMainPage = () => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  // NavBar 아이템 정의 - 실제 라우트 경로와 일치하도록 수정
  const navItems = [
    { label: '영상통화 생성', path: '/Control/main' },  // 메인에서 다이얼로그로 처리
    { label: '신고 접수', path: '/Control/patient-info' },
    { label: '출동 지정', path: '/Control/dispatch' },
    { label: '보조자 협업', path: '/Control/main' },  // 임시로 메인으로 연결
    { label: '신고 현황', path: '/Control/logs' }
  ];

  // 영상통화 생성 메뉴 클릭 처리를 위한 이벤트 핸들러 추가
  const handleVideoCallClick = () => {
    setIsVideoDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicHeader labels={[{ label: '메인페이지', href: '/' }, { label: '로그아웃', href: '/user' }]} />
      <NavBar navItems={navItems} />
      
      <div className="flex flex-col flex-1 items-center justify-center p-6">
        <div className="text-center mb-8">
          <p className="text-xl">"숨은 영웅들이 만드는 안전한 일상,</p>
          <p className="text-xl">우리 곁에 119가 있어 행복합니다."</p>
        </div>
        
        <div className="flex w-full max-w-5xl justify-between items-center mt-8">
          <div className="w-[400px]">
            <textarea 
              className="w-full h-[200px] px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              placeholder="신고 내용을 입력하세요"
            />
            <button className="w-full mt-4 px-4 py-3 bg-[#545F71] text-white rounded-md hover:bg-[#434b59]">
              AI 요약
            </button>
          </div>
          
          <div className="flex-1 flex justify-end">
            <img 
              src={controlMain}
              alt="Control room illustration" 
              className="w-[500px]"
            />
          </div>
        </div>
      </div>

      <VideoCallDialog
        isOpen={isVideoDialogOpen}
        onClose={() => setIsVideoDialogOpen(false)}
      />
    </div>
  );
};

export default ControlMainPage;