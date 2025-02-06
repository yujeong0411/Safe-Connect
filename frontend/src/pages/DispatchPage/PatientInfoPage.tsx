// src/components/pages/DispatchPage/PatientInfoPage.tsx
import React, { useState } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import { useForm } from 'react-hook-form';
import  Input  from '@/components/atoms/Input/Input';
import Button  from '@/components/atoms/Button/Button';

// 페이지 내에서 사용할 TextArea 컴포넌트 정의
const TextArea = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '' 
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <textarea
      className={`w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#545f71] ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
    />
  );
};

interface PatientFormData {
  name: string;
  gender: string;
  age: number;
  consciousness: string;
  preKTAS: number;
  patientContact: string;
  guardianContact: string;
  sbp: number;
  dbp: number;
  pr: number;
  bt: number;
  spo2: number;
  bst: number;
}

const PatientInfoPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormData>();
  
  // TextArea를 위한 상태 관리
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');

  const onSubmit = (data: PatientFormData) => {
    const formData = {
      ...data,
      symptoms,
      diagnosis,
      medications,
      notes,
    };
    console.log(formData);
  };

  return (
    <DispatchMainTemplate logoutDirect={() => Promise.resolve()}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">환자 정보 작성</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="이름"
                {...register('name', { required: true })}
                error={errors.name && '이름을 입력해주세요'}
              />
              {/* 다른 Input 필드들... */}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-4">
                <TextArea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="증상을 입력하세요"
                />
                <TextArea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="현재 병력을 입력하세요"
                />
                <TextArea
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="복용 중인 약물을 입력하세요"
                />
                <TextArea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="노바스크 정 관련 정보를 입력하세요"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="gray" type="button">삭제</Button>
            <Button variant="blue" type="submit">저장</Button>
          </div>
        </form>
      </div>
    </DispatchMainTemplate>
  );
};

export default PatientInfoPage;