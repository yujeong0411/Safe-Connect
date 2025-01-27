import { PublicHeaderProps } from '@components/organisms/PublicHeader/PublicHeader.types.ts';
import Logo from '@components/atoms/Logo.tsx';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

const PublicHeader = ({ labels = [] }: PublicHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 경로에 따른 메인 페이지 이동
  const getMainPath = () => {
    if (location.pathname.includes('/hospital')) return '/hospital';
    if (location.pathname.includes('/control')) return '/control';
    if (location.pathname.includes('/dispatch')) return '/dispatch';
    if (location.pathname.includes('/admin')) return '/admin';
    return '/user';
  };

  return (
    <header className="flex relative justify-between items-center pl-4 pr-10">
      <div onClick={() => navigate(getMainPath())}>
        <Logo />
      </div>

      <div className="flex gap-4">
        {labels.map((item, index) => (
          <Link key={index} to={item.href} className="text-[#3699ff]">
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default PublicHeader;
