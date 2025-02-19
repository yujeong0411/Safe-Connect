import { PublicHeaderProps } from '@components/organisms/PublicHeader/PublicHeader.types.ts';
import Logo from '@components/atoms/Logo.tsx';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {useAuth} from "@/hooks/useAuth.ts";
import {useSignupStore} from "@/store/user/signupStore.tsx";
import {decodeToken} from "@utils/tokenUtil.ts";

const PublicHeader = ({ labels = [] }: PublicHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, loginId} = useAuth();
  const { userName} = useSignupStore((state) => state.formData);

    const getMainPath = () => {
        const pathSegments = location.pathname.split('/');
        const domain = pathSegments[1]; // 첫 번째 경로 세그먼트 (user, hospital, control 등)

        // 개인정보처리방침과 이용약관 페이지일 경우
        if (domain === 'privacy' || domain === 'terms') {
            const token = sessionStorage.getItem('token');
            if (token) {
                const decodedToken = decodeToken(token);

                switch(decodedToken?.category) {
                    case 'HOSPITAL': return '/hospital/request';
                    case 'CONTROL': return '/control/main';
                    case 'DISPATCH': return '/dispatch/main';
                    case 'ADMIN': return '/admin/main';
                    case 'CALLER': return '/caller/main';
                    default: return '/user/main';
                }
            }
            return '/user/main'; // 토큰 없을 경우 기본값
        }


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

      <div className="flex gap-5 text-sm md:text-base">
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
