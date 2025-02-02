import MainTemplate from '@components/templates/MainTemplate.tsx';
import UserInfoTemplate from '@features/user/components/UserInfoTemplate.tsx';
import mediImg from '@assets/image/mediImg.png';
import SignupMediForm from '@features/auth/components/SignupMediForm.tsx';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useEffect } from 'react';
import { useLoadUserInfo } from '@/hooks/useLoadUserInfo.ts';
// import { signOut } from '@features/auth/servies/apiService.ts';

const UserMediPage = () => {
  const { updateMediInfo } = useAuthStore();
  const { formData, setFormData } = useSignupStore();
  const { loadUserInfo } = useLoadUserInfo('medi'); // 사용자 정보 가져오기

  useEffect(() => {
    (async () => {
      await initializePage();
    })();
  }, []); // 페이지 마운트 시 한 번만 실행

  const initializePage = async () => {
    try {
      const userMediInfo: { categoryName: string; mediList: { mediId: number }[] }[] | null =
        await loadUserInfo();
      console.log('받아온 사용자 의료 정보:', userMediInfo);

      if (userMediInfo) {
        // mediList 내의 ID들을 찾아서 변환
        const diseaseIds =
          userMediInfo
            .find((item: { categoryName: string }) => item.categoryName === '기저질환')
            ?.mediList.map((medi: { mediId: number }) => medi.mediId) || [];

        const medicationIds =
          userMediInfo
            .find((item: { categoryName: string }) => item.categoryName === '복용약물')
            ?.mediList.map((medi: { mediId: number }) => medi.mediId) || [];

        console.log('변환된 ID들:', { diseaseIds, medicationIds });

        // 함수형 업데이트가 아닌 객체를 직접 전달
        setFormData({
          ...formData, // 기존 formData 유지
          diseaseId: diseaseIds,
          medicationId: medicationIds,
        });
      }
      // 업데이트 후 상태 확인
      console.log('업데이트된 formData:', formData);
    } catch (error) {
      console.error('사용자 의료 정보 로드 실패:', error);
    }
  };

  const handleSave = async () => {
    try {
      const mediIds = [...(formData.diseaseId || []), ...(formData.medicationId || [])];

      // PUT만 사용
      await updateMediInfo({ mediIds });
      await loadUserInfo(); // 갱신된 데이터 다시 로드
      alert('저장하였습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패하였습니다.');
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
