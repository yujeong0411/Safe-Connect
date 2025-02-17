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
      <div className="w-full max-w-[1000px] flex items-center justify-center mt-5 scale-90">
        <Carousel />
      </div>
    </MainTemplate>
  );
};

export default UserMainPage;
