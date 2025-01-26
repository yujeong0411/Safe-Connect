import React from 'react';
import Dropdown from '@components/atoms/Dropdown/Dropdown.tsx';

const SignupMediForm = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-left w-full mb-10">의료 정보 입력</h1>
      <div className="flex flex-row gap-10 p-10 w-full max-w-5xl mx-auto">
        {/*왼쪽*/}
        <div className="flex-1">
          <Dropdown
            label="현재 병력"
            options={[
              { value: 'option1', label: '옵션 1' },
              { value: 'option2', label: '옵션 2' },
              { value: 'option3', label: '옵션 3' },
            ]}
            onChange={(value) => console.log('선택된 값:', value)}
          />
        </div>

        {/*오른쪽*/}
        <div className="flex-1">
          <Dropdown
            label="복용 약물"
            options={[
              { value: 'option1', label: '옵션 1' },
              { value: 'option2', label: '옵션 2' },
              { value: 'option3', label: '옵션 3' },
            ]}
            onChange={(value) => console.log('선택된 값:', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupMediForm;
