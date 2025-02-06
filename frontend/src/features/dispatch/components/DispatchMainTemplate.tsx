import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PublicHeader from '@/components/organisms/PublicHeader/PublicHeader';
import DispatchNavBar from './DispatchNavBar/DispatchNavBar';
import GuardianNotificationDialog from './GuardianNotificationDialog';

interface DispatchMainTemplateProps {
  children: React.ReactNode;
  logoutDirect: () => void | Promise<void>;
}

const DispatchMainTemplate = ({ children, logoutDirect }: DispatchMainTemplateProps) => {
  const location = useLocation();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutDirect();
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
      <div className="flex-1">{children}</div>
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
  );
};

export default DispatchMainTemplate;