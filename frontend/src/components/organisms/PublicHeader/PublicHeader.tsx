import { PublicHeaderProps } from '@components/organisms/PublicHeader/PublicHeader.types.ts';
import Logo from '@components/atoms/Logo.tsx';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

const PublicHeader = ({ labels = [] }: PublicHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

    const getMainPath = () => {
        const pathSegments = location.pathname.split('/');
        const domain = pathSegments[1]; // 첫 번째 경로 세그먼트 (user, hospital, control 등)

        switch(domain) {
            case 'hospital': return '/hospital/request';
            case 'control': return '/control/main';
            case 'dispatch': return '/dispatch/main';
            case 'admin': return '/admin/main';
            case 'user': return '/user/main';
        }
    };

  return (
    <header className="flex relative justify-between items-center pl-4 pr-10">
      <div onClick={() => navigate(getMainPath())}>
        <Logo />
      </div>

      <div className="flex gap-4">
        {labels.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            onClick={item.onClick || (() => navigate(item.href))}
            className="text-[#3699ff]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default PublicHeader;
