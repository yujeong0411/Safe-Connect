import React from 'react';
import WaveBackground from '@components/atoms/WaveBackground.tsx';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import loginImg2 from '@assets/image/loginImg2.png';

// LoginTemplate가 children 속성을 받아, 배경 위에 원하는 내용을 렌더링
const LoginTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-[#EEF2FF] overflow-x-hidden">
      <WaveBackground />
      <PublicHeader />
      {/* 로그인 폼 */}
      <div className="  absolute
        left-1/2
        top-1/2
        -translate-x-1/2
        -translate-y-1/2
        w-full
        max-w-[90%]
        sm:max-w-[430px]
        md:max-w-[626px]
        z-20">{children}</div>

      <img
        src={loginImg2}
        alt="decorative"
        className="  fixed
          left-1/2
          bottom-0
          -translate-x-1/2
          w-full
          max-w-[1000px]
          max-h-[500px]
          md:max-h-[800px]
          object-contain
          scale-110
          z-10"
      />
    </div>
  );
};

export default LoginTemplate;
