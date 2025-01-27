import MainTemplate from '@components/templates/MainTemplate.tsx';
import Carousel from '@features/user/components/Carousel.tsx';

const UserMainPage = () => {
  return (
    <MainTemplate
      navItems={[
        { label: '개인 정보 수정', path: '/user/info' },
        { label: '의료 정보 수정', path: '/user/medi' },
        { label: '비밀번호 수정', path: '/user/updatepassword' },
      ]}
    >
      <div className="mx-auto scale-75 transform-origin-top">
        <Carousel />
      </div>
    </MainTemplate>
  );
};

export default UserMainPage;
