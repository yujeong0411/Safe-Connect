import MainTemplate from '@components/templates/MainTemplate.tsx';
import Carousel from '@features/user/components/Carousel.tsx';
import {useAuthStore} from "@/store/user/authStore.tsx";

const UserMainPage = () => {
    const {logout} = useAuthStore();

  return (
    <MainTemplate
      navItems={[
        { label: '개인 정보 수정', path: '/user/info' },
        { label: '의료 정보 수정', path: '/user/medi' },
        { label: '비밀번호 수정', path: '/user/updatepassword' },
      ]}
      logoutDirect={logout}
    >
      <div className="w-full min-h-[700px] flex items-center justify-center scale-90 pr-20">
        <Carousel />
      </div>
    </MainTemplate>
  );
};

export default UserMainPage;
