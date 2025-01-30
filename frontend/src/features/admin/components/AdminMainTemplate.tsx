import React from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface AdminTemplateProps {
  children?: React.ReactNode;
  currentMenu?: string;
}

const AdminMainTemplate = ({ children, currentMenu }: AdminTemplateProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 추후 서비스에 로그아웃 함수 만들기
  const handleLogout = () => {
    // 로그아웃 처리 로직
    // 예: 토큰 제거, 상태 초기화 등
  };

  return (
    <div className="min-h-screen flex flex-row">
      {/* 사이드 네비게이션 바 */}
      <div className="w-[268px] min-w-[268px] bg-banner flex flex-col">
        <PublicHeader />

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col px-[50px] pt-[30px] text-white space-y-10">
          <div className="text-xl font-medium whitespace-nowrap">
            <h2 className="mb-3">사용자 관리</h2>
            <ul className="ml-4 mt-2 space-y-2 ">
              <li>
                <Link
                  to="/admin/hospitaldepart"
                  className={`cursor-pointer  ${pathname === '/admin/hospitaldepart' ? 'text-gray-400' : ''}`}
                >
                  병원 계정
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/firedepart"
                  className={`cursor-pointer ${pathname === '/admin/firedepart' ? 'text-gray-400' : ''}`}
                >
                  소방청 계정
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-xl font-medium">
            <h2>
              <Link
                to="/admin/serviceall"
                className={`cursor-pointer ${pathname === '/admin/serviceall' ? 'text-gray-400' : ''}`}
              >
                서비스 관리
              </Link>
            </h2>
          </div>

          <div className="text-xl font-medium">
            <h2 className="mb-3">시스템 관리</h2>
            <ul className="ml-4 mt-2 space-y-2">
              <li>
                <Link
                  to="/admin"
                  className={`cursor-pointer ${pathname === '/admin' ? 'text-gray-400' : ''}`}
                >
                  의약 질환 관리
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className={`cursor-pointer  ${pathname === '/admin' ? 'text-gray-400' : ''}`}
                >
                  로그 관리
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col p-16 bg-bg">
        <div className="flex justify-end mb-5">
          <span
            onClick={handleLogout}
            className="text-[#3699ff] ml-2 cursor-pointer hover:underline"
          >
            로그아웃
          </span>
        </div>

        <div className="flex flex-col p-5">
          {/* 페이지 제목 영역 */}
          <div className="flex  items-center gap-2.5 mb-8">
            <h1 className="text-[32px] font-bold  flex-shrink-0 text-[#112031]">
              {currentMenu === 'fire' && '소방청 계정'}
              {currentMenu === 'hospital' && '병원 계정'}
              {currentMenu === 'service' && '서비스 관리'}
              {currentMenu === 'medicine' && '의약 질환 관리'}
              {currentMenu === 'log' && '로그 관리'}
            </h1>
            {(currentMenu === 'fire' ||
              currentMenu === 'hospital' ||
              currentMenu === 'service') && (
              <Button width="auto" size="sm" className="whitespace-nowrap">
                {currentMenu === 'service' ? '전체 조회' : '신규생성'}
              </Button>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminMainTemplate;
