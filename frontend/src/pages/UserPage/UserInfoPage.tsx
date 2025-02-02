import MainTemplate from '@components/templates/MainTemplate.tsx';
import UserInfoTemplate from '@features/user/components/UserInfoTemplate.tsx';
import userImg from '@assets/image/userImg.png';
import UserInfoForm from '@features/user/components/UserInfoForm.tsx';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useEffect } from 'react';
import { useLoadUserInfo } from '@/hooks/useLoadUserInfo.ts';

const UserInfoPage = () => {
  const { loadUserInfo } = useLoadUserInfo('user');
  const { updateUserInfo } = useAuthStore();
  const { formData, validateFields } = useSignupStore();

  // 정보 가져오기
  useEffect(() => {
    loadUserInfo();
  }, []);

  // 정보 저장 핸들러
  const handleSave = async () => {
    // 유효성 검사
    const phoneError = validateFields('userPhone', formData.userPhone);
    // 필수가 아니므로 있을때만 유효성 검사 시행
    const protectorPhoneError = formData.userProtectorPhone
      ? validateFields('userProtectorPhone', formData.userProtectorPhone)
      : '';

    // 에러가 있으면 저장 안함.
    if (phoneError || protectorPhoneError) {
      const errors = [];
      if (phoneError) errors.push(phoneError);
      if (protectorPhoneError) errors.push(protectorPhoneError);

      alert(errors.join('\n'));
      return;
    }

    try {
      await updateUserInfo({
        userPhone: formData.userPhone,
        userProtectorPhone: formData.userProtectorPhone,
      });
      alert('저장하였습니다.');
    } catch (error) {
      alert('정보 저장에 실패했습니다.');
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
    >
      <UserInfoTemplate
        title="개인 정보 수정"
        content="회원님의 개인정보는 응급 상황 발생 시 본인 확인과 보호자 연락에 사용됩니다. 이름, 이메일, 생년월일을 제외한 연락처 정보를 수정할 수 있습니다."
        logoSrc={userImg}
        primaryButtonOnClick={handleSave}
        secondaryButtonOnClick={handleSignout}
      >
        <UserInfoForm />
      </UserInfoTemplate>
    </MainTemplate>
  );
};

export default UserInfoPage;
