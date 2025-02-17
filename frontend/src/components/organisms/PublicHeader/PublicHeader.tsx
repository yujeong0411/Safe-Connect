import { PublicHeaderProps } from '@components/organisms/PublicHeader/PublicHeader.types.ts';
import Logo from '@components/atoms/Logo.tsx';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {useAuth} from "@/hooks/useAuth.ts";
import {useSignupStore} from "@/store/user/signupStore.tsx";

const PublicHeader = ({ labels = [] }: PublicHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, loginId} = useAuth();
  const { userName} = useSignupStore((state) => state.formData);

    const getMainPath = () => {
        const pathSegments = location.pathname.split('/');
        const domain = pathSegments[1]; // 첫 번째 경로 세그먼트 (user, hospital, control 등)

        switch(domain) {
            case 'hospital': return '/hospital/request';
            case 'control': return '/control/main';
            case 'dispatch': return '/dispatch/main';
            case 'admin': return '/admin/main';
            case 'user': return '/user/main';
            default:
                return '/';  // 기본 경로 추가
        }
    };

    // 사용자명 가져오기
    const getUserName = () => {
        // 일반 유저
        if (userType === 'user') {
            return userName;
        }

        // 다른 유저
        if (loginId) {
            return loginId;
        }
    }

  return (
    <header className="flex relative justify-between items-center pl-4 pr-10">
      <div onClick={() => navigate(getMainPath())}>
        <Logo />
      </div>

      <div className="flex gap-3 text-sm md:text-base">
        {getUserName() && (
          <span className="text-gray-700">
            <span className="text-pink-500 px-2 py-2">{getUserName()}</span>님
            <span className="mx-2 text-gray-400 pl-4">|</span>
          </span>
        )}
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
