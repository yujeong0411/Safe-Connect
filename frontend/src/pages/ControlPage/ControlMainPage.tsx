// src/pages/ControlPage/ControlMainPage.tsx
import React, { useState, useEffect } from 'react';
import MainTemplate from '@components/templates/MainTemplate';
import VideoCallDialog from '@components/organisms/VideoCallDialog/VideoCallDialog';
import GuardianNotifyDialog from '@components/organisms/GuardianNotifyDialog/GuardianNotifyDialog';

const ControlMainPage = () => {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isGuardianNotifyOpen, setIsGuardianNotifyOpen] = useState(false);

  const navItems = [
    { label: '영상통화 생성', path: '/Control/main' },
    { label: '신고 접수', path: '/Control/patient-info' },
    { label: '출동 지령', path: '/Control/dispatch' },
    { label: '보호자 알림', path: '/Control/main' },
    { label: '신고 목록', path: '/Control/logs' },
  ];

  // URL 경로 변경 감지하여 다이얼로그 표시
  useEffect(() => {
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const dialog = searchParams.get('dialog');

    if (pathname === '/Control/main') {
      if (dialog === 'video') {
        setIsVideoCallOpen(true);
      } else if (dialog === 'guardian') {
        setIsGuardianNotifyOpen(true);
      }
    }
  }, [window.location.pathname, window.location.search]);

  return (
    <>
      <MainTemplate navItems={navItems}>{/* 기존 mainContent 내용 */}</MainTemplate>

      <VideoCallDialog isOpen={isVideoCallOpen} onClose={() => setIsVideoCallOpen(false)} />

      <GuardianNotifyDialog
        isOpen={isGuardianNotifyOpen}
        onClose={() => setIsGuardianNotifyOpen(false)}
      />
    </>
  );
};

export default ControlMainPage;
