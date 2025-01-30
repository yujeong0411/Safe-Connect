// src/pages/ControlPage/PatientInfoPage.tsx
import React from 'react';
import Input from '@components/atoms/Input/Input';
import Button from '@components/atoms/Button/Button';

const PatientInfoPage = () => {
  // Input 컴포넌트의 스타일을 재사용하기 위한 클래스
  const textareaStyle = `
    w-full 
    rounded-md 
    border 
    outline-none 
    focus:ring-2
    focus:ring-blue-200
    bg-[#FFFFFF]
    px-3 
    py-3 
    text-base
    resize-none
  `;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 메인 컨텐츠 */}
      <div className="flex">
        {/* 좌측: 영상통화 영역 */}
        <div className="w-1/3 p-4">
          <div className="bg-gray-200 h-[300px] mb-4">
            <img src="/patient-video.png" alt="Video call" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                신고 내용
              </label>
              <textarea 
                className={`${textareaStyle} h-32`}
                placeholder="신고 내용을 입력하세요"
              />
            </div>
            <Button variant="blue" className="w-full">
              AI 요약
            </Button>
          </div>
        </div>

        {/* 우측: 입력 폼 */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="mb-4 flex justify-between items-center">
              <Input label="환자 전화번호" width="quarter" />
              <Button variant="blue" size="md">
                조회
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="성명" />
              <Input label="성별" />
              <Input label="나이" />
              <Input label="보호자 연락처" />
              <Input label="현재 위치" className="col-span-2" />
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  특이사항
                </label>
                <textarea 
                  className={`${textareaStyle} h-32`}
                  placeholder="특이사항을 입력하세요"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button variant="gray">이전</Button>
              <Button variant="blue">다음</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoPage;