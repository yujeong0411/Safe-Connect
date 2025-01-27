import React, { useState } from 'react';
import Input from '@components/atoms/Input/Input.tsx';
import { ResidentNumberInput } from '@features/auth/components/ResidentNumberInput.tsx';

const UserInfoForm = () => {
  const [formData, setFormData] = useState({
    userEmail: '',
    userName: '',
    userPhone: '',
    userBirthday: '',
    userGender: '',
    userProtectorPhone: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };
  return (
    <div>
      <div className="flex flex-row gap-20">
        {/*왼쪽*/}
        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {/*이메일 (비활성화)*/}
            <Input
              label="이메일"
              value={formData.userEmail}
              onChange={handleChange('userEmail')}
              isRequired
              disabled
            />
            <Input
              label="이름"
              value={formData.userName}
              onChange={handleChange('userName')}
              isRequired
              disabled
            />
            <Input
              label="전화번호"
              value={formData.userPhone}
              onChange={handleChange('userPhone')}
              isRequired
            />
          </div>
        </div>

        {/*오른쪽*/}
        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {/*주민등록번호 (비활성화)*/}
            <ResidentNumberInput disabled={true} value={formData.userBirthday} />
            <Input
              label="보호자 연락처"
              value={formData.userProtectorPhone}
              onChange={handleChange('userProtectorPhone')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
