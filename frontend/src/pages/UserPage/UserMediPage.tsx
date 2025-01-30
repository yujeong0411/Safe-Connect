import MainTemplate from '@components/templates/MainTemplate.tsx';
import UserInfoTemplate from '@features/user/components/UserInfoTemplate.tsx';
import mediImg from '@assets/image/mediImg.png';
import SignupMediForm from '@features/auth/components/SignupMediForm.tsx';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useEffect, useRef } from 'react';
import { useLoadUserInfo } from '@/hooks/useLoadUserInfo.ts';
import { signOut } from '@features/auth/servies/apiService.ts';

const UserMediPage = () => {
  const { updateMediInfo } = useAuthStore();
  const { formData } = useSignupStore();
  const { loadUserInfo, isLoading } = useLoadUserInfo('medi'); // 사용자 정보 가져오기

  useEffect(() => {
    loadUserInfo();
  }, []);

  const handleSave = async () => {
    try {
      console.log('Sending medical info:', {
        diseaseId: formData.diseaseId,
        medicationId: formData.medicationId,
      });
      await updateMediInfo({
        mediIds: [...(formData.diseaseId || []), ...(formData.medicationId || [])],
      });
      alert('저장하였습니다.');
    } catch (error) {
      console.error('저장 실패 상세 에러:', error.response?.data);
      alert('저장에 실패하였습니다.');
    }
  };

  // 회원탈퇴 핸들러
  const handleSignout = async () => {
    await signOut();
  };

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
        primaryButtonOnClick={handleSave}
        secondaryButtonOnClick={handleSignout}
      >
        <SignupMediForm />
      </UserInfoTemplate>
    </MainTemplate>
  );
};

export default UserMediPage;
