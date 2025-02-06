// JoinSessionPage.tsx
import React, { useEffect } from 'react';
import { Outlet, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';

const JoinSessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const openViduStore = useOpenViduStore();

  useEffect(() => {
    const username = searchParams.get('username') || `Guest_${Math.floor(Math.random() * 100)}`;
    const directJoin = searchParams.get('direct');

    if (sessionId) {
      openViduStore.handleChangeSessionId({
        target: { value: sessionId }
      } as React.ChangeEvent<HTMLInputElement>);

      if (directJoin === 'true') {
        openViduStore.handleChangeUserName({
          target: { value: username }
        } as React.ChangeEvent<HTMLInputElement>);

        navigate(`/openvidu/join/${sessionId}/room`);
      }
    }
  }, [sessionId, searchParams]);

  return <Outlet context={{ sessionId }} />;
};

export default JoinSessionPage;