import React from 'react';
import WaveBackground from '@components/atoms/WaveBackground';
import PublicHeader from '@components/organisms/PublicHeader';
import loginImg1 from '@assets/image/loginImg1.png';
import loginImg2 from '@assets/image/loginImg2.png';

// LoginTemplate가 children 속성을 받아, 배경 위에 원하는 내용을 렌더링
const LoginTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-[#EEF2FF] overflow-x-hidden">
      <WaveBackground />
      <PublicHeader />
      {/* 로그인 폼 */}
      <div className="absolute left-[100px] top-[235px] z-20">{children}</div>

      {/* 2xl 이상에서만 표시 */}
      <img
        src={loginImg1}
        alt="decorative"
        className="fixed right-[100px] top-[242px] hidden 2xl:block z-0 transition-transform duration-100"
      />

      <img
        src={loginImg2}
        alt="decorative"
        className="fixed left-1/2 bottom-0 -translate-x-1/2 w-[1000px] h-auto max-w-[90vw] max-h-[500px] md:max-h-[800px] scale-110 z-10"
      />
    </div>
  );
};

export default LoginTemplate;
