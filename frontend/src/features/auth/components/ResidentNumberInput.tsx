import React, { useState } from 'react';
import Input from '@components/atoms/Input/Input.tsx';

// 주민등록번호 7자리 검사
export const ResidentNumberInput = ({
  disabled = false,
  value,
  onChange,
  error: externalError, // props로 받은 error
}: {
  disabled?: boolean;
  value: string;
  onChange: (birthdayAndGender: { userBirthday: string; userGender: string }) => void;
  error?: boolean;
}) => {
  const [firstPart, setFirstPart] = useState(''); // 앞 6자리
  const [seventhDigit, setSeventhDigit] = useState(''); // 7번째 자리
  const [internalError, setInternalError] = useState('');

  // 생년월일과 성별 추출 및 포맷팅 함수
  const extractBirthdayAndGender = (firstPart: string, seventhDigit: string) => {
    if (firstPart.length !== 6 || seventhDigit.length !== 1) return null;
    // 성별에 따른 연도 계산
    const genderDigit = parseInt(seventhDigit);
    const birthYear =
      genderDigit <= 2
        ? '19' + firstPart.slice(0, 2)
        : genderDigit <= 4
          ? '20' + firstPart.slice(0, 2)
          : null;

    // 성별 결정
    const gender = genderDigit % 2 === 1 ? 'M' : 'F';

    // 생년월일 포맷팅 (YYMMDD)
    const birthday = birthYear ? firstPart : null;

    if (!birthYear || !birthday) return null;

    return { userBirthday: birthday, userGender: gender };
  };

  const handleFirstPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setFirstPart(newValue); // 상태 업데이트

    if (value.length < 6) {
      setInternalError('6자리를 입력해주세요.');
      onChange({ userBirthday: '', userGender: '' });
    } else {
      setInternalError('');
      if (seventhDigit) {
        const result = extractBirthdayAndGender(newValue, seventhDigit);
        if (result) onChange(result);
      }
    }
  };

  const handleSeventhDigitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    if (firstPart.length !== 6) {
      setInternalError('앞자리 6자리를 먼저 입력해주세요.');
      return;
    }

    if (newValue.length > 0 && (parseInt(newValue) < 1 || parseInt(newValue) > 4)) {
      setInternalError('유효하지 않은 주민등록번호 형식입니다.');
      onChange({ userBirthday: '', userGender: '' });
      return;
    }

    if (newValue.length <= 1) {
      setSeventhDigit(newValue);

      if (firstPart.length === 6) {
        const result = extractBirthdayAndGender(firstPart, newValue);
        if (result) {
          onChange(result);
          setInternalError(''); // 모든 조건이 만족될 때만 에러 메시지 제거
        }
      } else {
        setInternalError('주민등록번호 7자리를 올바르게 입력해주세요.');
      }
    }
  };

  // 내부 에러와 외부 에러 중 하나라도 있으면 표시
  const displayError = externalError || internalError;

  return (
    <div>
      <div className="flex items-end gap-1">
        <Input
          label="주민등록번호 6자리" // 마스킹을 해야하나??
          value={firstPart}
          onChange={handleFirstPartChange}
          maxLength={6}
          width="full"
          isRequired
          disabled={disabled}
        />
        <span className="text-2xl mb-3">-</span>
        <div className="flex items-center">
          <Input
            value={seventhDigit}
            onChange={handleSeventhDigitChange}
            maxLength={1}
            isRequired
            disabled={disabled}
            className="w-6 mr-1"
          />
          <span className="text-xl">******</span>
        </div>
      </div>
      {displayError && <p className="text-red-500 text-sm mt-1">{displayError}</p>}
    </div>
  );
};
