import MainTemplate from '@components/templates/MainTemplate.tsx';
import UserInfoTemplate from '@features/user/components/UserInfoTemplate.tsx';
import pwImg from '@assets/image/pwImg.png';
import UserPwForm from '@features/user/components/UserPwForm.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { validatePassword, validatePasswordConfirm } from '@utils/validation.ts';

const UserUpdatePassword = () => {
  const { formData } = useSignupStore();
  const { updatePassword, logout } = useAuthStore();

  // 비밀번호 변경 요청 처리
  const handlePasswordUpdate = async () => {
    try {
      if (!validatePassword(formData.userPassword)) {
        alert('비밀번호는 숫자, 문자, 특수문자를 포함하여 8자리 이상이어야 합니다.');
        return;
      }
      if (!validatePasswordConfirm(formData.userPassword, formData.passwordConfirm)) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      await updatePassword({
        userPassword: formData.userPassword,
        newPassword: formData.passwordConfirm,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      alert('비밀번호 변경에 실패했습니다.');
      console.error('비밀번호 변경 실패:', error);
    }
  };

  // 회원탈퇴 핸들러
  const handleSignout = async () => {};

  return (
    <MainTemplate
      navItems={[
        { label: '개인 정보 수정', path: '/user/info' },
        { label: '의료 정보 수정', path: '/user/medi' },
        { label: '비밀번호 수정', path: '/user/updatepassword' },
      ]}
      logoutDirect={logout}
    >
      <UserInfoTemplate
        title="비밀번호 수정"
        content="안전한 서비스 이용을 위해 영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 설정해 주세요. "
        logoSrc={pwImg}
        primaryButtonOnClick={handlePasswordUpdate}
        secondaryButtonOnClick={handleSignout}
      >
        <UserPwForm />
      </UserInfoTemplate>
    </MainTemplate>
  );
};

export default UserUpdatePassword;
