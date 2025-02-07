
import React, { useEffect } from 'react';
import { Outlet, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import NavBar from '@components/organisms/NavBar/NavBar.tsx';
import CallerVideoSessionUI from '@features/caller/component/CallerVideoSessionUI.tsx';
import CallerMapDialog from '@features/caller/component/CallerMapDialog.tsx';

const CallerErrorPage: React.FC = () => {

  return (
    <div className="mih-h-screen bg-bg flex flex-col">
      <PublicHeader labels={[]} />
      <div className="flex-1 min-h-[calc(100vh-100px)]">
        <h1>에러가 있습니다.</h1>
      </div>
    </div>
  );
};

export default CallerErrorPage;