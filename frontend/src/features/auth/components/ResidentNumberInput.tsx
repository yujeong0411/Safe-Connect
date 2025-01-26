import React, { useState } from 'react';
import Input from '@components/atoms/Input/Input.tsx';

// 주민등록번호 7자리 검사
export const ResidentNumberInput = () => {
  const [firstPart, setFirstPart] = useState(''); // 앞 6자리
  const [seventhDigit, setSeventhDigit] = useState(''); // 7번째 자리
  const [error, setError] = useState('');

  const handleFirstPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 입력 가능

    //6자리 제한
    if (value.length <= 6) {
      setFirstPart(value);
      setError('');
    }
  };

  const handleSeventhDigitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    // 성별 체크 (1-4 사이)
    if (value.length > 0 && (parseInt(value) < 1 || parseInt(value) > 4)) {
      setError('유효하지 않은 주민등록번호 형식입니다.');
      return;
    }

    if (value.length <= 1) {
      setSeventhDigit(value);
      setError('');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1">
        <Input
          label="주민등록번호 7자리" // 마스킹을 해야하나??
          value={firstPart}
          onChange={handleFirstPartChange}
          maxLength={6}
          width="full"
          isRequired
        />
        <span className="text-2xl">-</span>
        <div className="flex items-center">
          <Input
            value={seventhDigit}
            onChange={handleSeventhDigitChange}
            maxLength={1}
            className="w-6 mr-1"
            isRequired
          />
          <span className="text-xl">******</span>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
