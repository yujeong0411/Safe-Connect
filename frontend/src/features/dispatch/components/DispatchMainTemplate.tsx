// src/features/dispatch/components/DispatchMainTemplate.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PublicHeader from '@/components/organisms/PublicHeader/PublicHeader';
import DispatchNavBar from './DispatchNavBar/DispatchNavBar';
import GuardianNotificationDialog from './GuardianNotificationDialog';
import VideoCallDrawer from './VideoCall/VideoCallDrawer';
import { useDispatchAuthStore } from '@/store/dispatch/dispatchAuthStore.tsx';

interface DispatchMainTemplateProps {
  children: React.ReactNode;
}

const DispatchMainTemplate = ({ children }: DispatchMainTemplateProps) => {
  const location = useLocation();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const {logout} = useDispatchAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/dispatch');
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  const navItems = [
    {
      label: '출동 현황',
      path: '/dispatch/main',
      active: location.pathname === '/dispatch/main'
    },
    {
      label: '환자정보 작성',
      path: '/dispatch/patient-info',
      active: location.pathname === '/dispatch/patient-info'
    },
    {
      label: '이송 요청',
      path: '/dispatch/transfer-request',
      active: location.pathname === '/dispatch/transfer-request'
    },
    {
      label: '영상통화 연결',
      path: '#',
      hasModal: true,
      onModalOpen: () => setShowVideoCall(true)
    },
    {
      label: '보호자 알림',
      path: '#',
      hasModal: true,
      onModalOpen: () => setShowNotificationModal(true)
    }
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="-space-y-4">
        <PublicHeader
          labels={[
            {
              label: '로그아웃',
              href: '#',
              onClick: handleLogout,
            },
          ]}
        />
        <DispatchNavBar navItems={navItems} />
      </div>
      <div className="flex-1 relative">
      <div className={`transition-all duration-300 ${showVideoCall ? 'ml-[50%] w-[50%]' : 'w-full'}`}>
          {children}
        </div>
        <VideoCallDrawer 
          isOpen={showVideoCall}
          onClose={() => setShowVideoCall(false)}
        />
        <GuardianNotificationDialog
          open={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          patientInfo={{
            name: "김환자",
            hospitalName: "서울대병원"
          }}
          guardianContact="010-1234-5678"
        />
      </div>
    </div>
  );
};

export default DispatchMainTemplate;