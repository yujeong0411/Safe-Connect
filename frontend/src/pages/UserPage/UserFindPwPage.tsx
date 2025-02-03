import { useState } from 'react';
import UserFindTemplate from '@features/user/components/UserFindTemplate.tsx';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';
// import { useSignupStore } from '@/store/user/signupStore.tsx';
import UserFindPwForm from '@features/user/components/UserFindPwForm.tsx';

const UserFindPwPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<'form' | 'success' | 'fail'>('form');
  const { findPassword } = useAuthStore();
  const [userEmail, setUserEmail] = useState('');

  // 비밀번호 찾기 핸들링
  const handleFindPw = async () => {
    try {
      if (!userEmail) {
        alert('이메일을 입력해주세요.');
        return;
      }

      const isSuccess = await findPassword(userEmail); // boolean 반환값 사용
      if (isSuccess) {
        setState('success');
      } else {
        alert('비밀번호 찾기에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 찾기 실패:', error);
      alert('올바른 이메일을 입력하세요.');
    }
  };

  // 상황에 따른 다른 랜더링
  const renderContent = () => {
    switch (state) {
      // 이메칠 찾기 페이지
      case 'form':
        return (
          <UserFindTemplate
            title="비밀번호 찾기"
            subtitle="회원가입 시 사용한 이메일을 입력하세요. 임시비밀번호가 이메일로 발송됩니다."
            primaryButton={{ text: '비밀번호 찾기', onClick: handleFindPw }}
            secondaryButton={{ text: '이메일 찾기', onClick: () => navigate('/user/findEmail') }}
          >
            <UserFindPwForm onEmailChange={setUserEmail} />
          </UserFindTemplate>
        );

      // 이메일 찾기 성공 페이지
      case 'success':
        return (
          <UserFindTemplate
            title="임시 비밀번호가 이메일로 발송되었습니다."
            subtitle="입력한 이메일에서 확인하세요."
            primaryButton={{
              text: '이메일 찾기',
              onClick: () => navigate('/user/findemail'),
            }}
          />
        );
    }
  };

  return renderContent();
};

export default UserFindPwPage;
