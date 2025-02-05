// JoinSessionPage.tsx
import React, { useEffect } from 'react';
import { Outlet, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useOpenViduStore } from '@/test/store/OpenViduStore';

const JoinSessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const openViduStore = useOpenViduStore();

  useEffect(() => {
    const username = searchParams.get('username');
    const directJoin = searchParams.get('direct');

    if (sessionId) {
      openViduStore.handleChangeSessionId({
        target: { value: sessionId }
      } as React.ChangeEvent<HTMLInputElement>);

      if (username && directJoin === 'true') {
        // URL에 username과 direct=true가 있으면 바로 세션 참여
        openViduStore.handleChangeUserName({
          target: { value: username }
        } as React.ChangeEvent<HTMLInputElement>);

        navigate(`/openvidu/room/${sessionId}`);
      }
    }
  }, [sessionId, searchParams]);

  return <Outlet context={{ sessionId }} />;
};

export default JoinSessionPage;