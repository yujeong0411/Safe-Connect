import MainTemplate from '@components/templates/MainTemplate.tsx';
import UserInfoTemplate from '@features/user/components/UserInfoTemplate.tsx';
import mediImg from '@assets/image/mediImg.png';
import SignupMediForm from '@features/auth/components/SignupMediForm.tsx';

const UserMediPage = () => {
  return (
    <MainTemplate
      navItems={[
        { label: '개인 정보 수정', path: '/user/info' },
        { label: '의료 정보 수정', path: '/user/medi' },
        { label: '비밀번호 수정', path: '/user/updatepassword' },
      ]}
    >
      <UserInfoTemplate
        title="의료 정보 수정"
        content="귀하의 건강 정보는 응급 상황에서 119구급대원과 응급실 의료진이 즉시 확인하여 적절한 응급 처치를 제공하는 데 사용됩니다.
현재 질환과 복용 약물을 입력해 주세요."
        logoSrc={mediImg}
      >
        <SignupMediForm />
      </UserInfoTemplate>
    </MainTemplate>
  );
};

export default UserMediPage;
