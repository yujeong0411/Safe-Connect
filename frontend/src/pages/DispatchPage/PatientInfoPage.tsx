// src/components/pages/DispatchPage/PatientInfoPage.tsx
import { useForm } from 'react-hook-form';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import Input from '@/components/atoms/Input/Input';
import Button from '@/components/atoms/Button/Button';
import DispatchTextArea from '@/features/dispatch/components/DispatchTextArea';
interface PatientFormData {
  name: string;
  gender: string;
  ageGroup: string;
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
  symptoms: string;
  medicalHistory: string;
  medications: string;
  reportSummary: string;
}

const PatientInfoPage = () => {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<PatientFormData>({
    defaultValues: {
      bt: 36.5,
    },
  });

  const ageGroups = [
    '10대 미만',
    '10대',
    '20대',
    '30대',
    '40대',
    '50대',
    '60대',
    '70대',
    '80대',
    '90대 이상',
  ];

  const onSubmit = (data: PatientFormData) => {
    console.log(data);
  };

  return (
    <DispatchMainTemplate logoutDirect={() => Promise.resolve()}>
      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">환자 정보 작성</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
          {/* 기본 정보 섹션 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">기본 정보</h3>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <Input 
                  label="이름" 
                  {...register('name')} 
                  width="full"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="성별"
                  {...register('gender')}
                  width="full"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">연령대</label>
                <select
                  {...register('ageGroup')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {ageGroups.map((age) => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <Input
                  label="의식상태"
                  {...register('consciousness')}
                  width="full"
                />
              </div>
              <div className="col-span-3">
                <Input
                  label="환자 연락처"
                  {...register('patientContact')}
                  width="full"
                />
              </div>
            </div>
          </div>

          {/* 생체 징후 섹션 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">생체 징후</h3>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2">
                <Input
                  label="SBP"
                  type="text"
                  pattern="\d*"
                  {...register('sbp')}
                  width="full"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="DBP"
                  type="text"
                  pattern="\d*"
                  {...register('dbp')}
                  width="full"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="PR"
                  type="text"
                  pattern="\d*"
                  {...register('pr')}
                  width="full"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="BT"
                  type="text"
                  pattern="\d*\.?\d*"
                  {...register('bt')}
                  width="full"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="SPO2"
                  type="text"
                  pattern="\d*"
                  {...register('spo2')}
                  width="full"
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="BST"
                  type="text"
                  pattern="\d*"
                  {...register('bst')}
                  width="full"
                />
              </div>
            </div>
          </div>

          {/* 상세 정보 섹션 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">상세 정보</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <DispatchTextArea
                  register={register('symptoms')}
                  placeholder="증상 및 특이사항"
                  className="h-24"
                />
                <DispatchTextArea
                  register={register('medicalHistory')}
                  placeholder="기저 질환"
                  className="h-24"
                />
              </div>
              <div className="space-y-4">
                <DispatchTextArea
                  register={register('medications')}
                  placeholder="복용 약물"
                  className="h-24"
                />
                <DispatchTextArea
                  register={register('reportSummary')}
                  placeholder="신고 요약본"
                  className="h-24"
                />
              </div>
            </div>
          </div>

          {/* 보호자 정보 섹션 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">보호자 정보</h3>
            <div className="max-w-md">
              <Input
                label="보호자 연락처"
                {...register('guardianContact')}
                width="full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="gray" type="button" width="auto">
              취소
            </Button>
            <Button variant="blue" type="submit" width="auto">
              저장
            </Button>
          </div>
        </form>
      </div>
    </DispatchMainTemplate>
  );
};

export default PatientInfoPage;