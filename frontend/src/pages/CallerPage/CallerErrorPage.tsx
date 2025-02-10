
import React from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';

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