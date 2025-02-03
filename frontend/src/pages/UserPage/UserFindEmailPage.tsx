import { useState } from 'react';
import UserFindTemplate from '@features/user/components/UserFindTemplate.tsx';
import UserFindEmailForm from '@features/user/components/UserFindEmailForm';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';

const UserFindEmailPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<'form' | 'success' | 'fail'>('form');
  const { findEmail, userEmail } = useAuthStore();
  const { formData } = useSignupStore();

  // 이메일 찾기 핸들링
  const handleFindEmail = async () => {
    try {
      const cleanUserName = formData.userName.trim(); // 공백 제거

      // findEmail 함수 실행
      await findEmail(cleanUserName, formData.userPhone);
      setState('success');
    } catch (error) {
      console.error('이메일 찾기 실패:', error);
      // 에러 메시지를 alert로 표시
      alert('이메일을 찾을 수 없습니다.');
    }
  };

  // 상황에 따른 다른 랜더링
  const renderContent = () => {
    switch (state) {
      // 이메칠 찾기 페이지
      case 'form':
        return (
          <UserFindTemplate
            title="이메일 찾기"
            subtitle="이름과 회원가입 시 사용한 전화번호를 입력하세요."
            primaryButton={{ text: '이메일 찾기', onClick: handleFindEmail }}
            secondaryButton={{
              text: '비밀번호 찾기',
              onClick: () => navigate('/user/findpassword'),
            }}
          >
            <UserFindEmailForm />
          </UserFindTemplate>
        );

      // 이메일 찾기 성공 페이지
      case 'success':
        return (
          <UserFindTemplate
            title="이메일이 조회되었습니다."
            subtitle={`가입한 이메일 : ${userEmail}`}
            primaryButton={{
              text: '비밀번호 찾기',
              onClick: () => navigate('/user/findpassword'),
            }}
          />
        );
    }
  };

  return renderContent();
};

export default UserFindEmailPage;
