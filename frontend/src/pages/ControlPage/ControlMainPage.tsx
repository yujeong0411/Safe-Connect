// ControlMainPage.tsx
import ControlMainTemplate from '@features/control/components/ControlMainTemplate.tsx';
import CallRecordForm from '@features/control/components/CallRecordForm.tsx';
import { useControlsseStore } from '@/store/control/controlsseStore.ts';
import { useEffect } from 'react';
import { useControlAuthStore } from '@/store/control/controlAuthStore.tsx';

const ControlMainPage = () => {
  const { connect } = useControlsseStore();
  const { isAuthenticated } = useControlAuthStore(); // 인증 상태 확인

  useEffect(() => {
    const connectSSE = () => {
      const userName = localStorage.getItem("userName");
      if (userName && isAuthenticated) {
        connect(userName);
      }
    };

    connectSSE(); // 초기 연결

    // 새로고침 시 연결
    window.addEventListener('load', connectSSE);

    return () => {
      window.removeEventListener('load', connectSSE);
    };
  }, [connect, isAuthenticated]);

  return (
    <ControlMainTemplate>
      <CallRecordForm />
    </ControlMainTemplate>
  );
};

export default ControlMainPage;