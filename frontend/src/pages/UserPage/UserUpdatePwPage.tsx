import MainTemplate from '@components/templates/MainTemplate.tsx';
import UserInfoTemplate from '@features/user/components/UserInfoTemplate.tsx';
import pwImg from '@assets/image/pwImg.png';
import UserPwForm from '@features/user/components/UserPwForm.tsx';

const UserUpdatePassword = () => {
  return (
    <MainTemplate
      navItems={[
        { label: '개인 정보 수정', path: '/user/info' },
        { label: '의료 정보 수정', path: '/user/medi' },
        { label: '비밀번호 수정', path: '/user/updatepassword' },
      ]}
    >
      <UserInfoTemplate
        title="비밀번호 수정"
        content="안전한 서비스 이용을 위해 영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 설정해 주세요. "
        logoSrc={pwImg}
      >
        <UserPwForm />
      </UserInfoTemplate>
    </MainTemplate>
  );
};

export default UserUpdatePassword;
