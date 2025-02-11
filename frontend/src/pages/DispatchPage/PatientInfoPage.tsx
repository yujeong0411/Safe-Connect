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
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            {/* 기본 정보 섹션 */}
            <div className="grid grid-cols-6 gap-4 items-end mb-6">
              <Input label="이름" {...register('name')} width="auto" className="col-span-1" />
              <Input
                label="성별"
                {...register('gender')}
                width="half"
                className="col-span-1 max-w-[140px]"
              />
              <div className="col-span-1">
                <label className="block text-gray-700 text-sm font-medium mb-1">연령대</label>
                <select
                  {...register('ageGroup')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {ageGroups.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="의식상태"
                {...register('consciousness')}
                width="half"
                className="col-span-1 max-w-[140px]"
              />
              <Input
                label="pre-KTAS"
                type="text"
                pattern="\d*"
                {...register('preKTAS')}
                width="half"
                className="col-span-1 max-w-[140px]"
              />
              <Input
                label="환자 연락처"
                {...register('patientContact')}
                width="auto"
                className="col-span-1"
              />
            </div>

            {/* 생체 징후 섹션 */}
            <div className="grid grid-cols-7 gap-4 items-end mb-6">
              <Input
                label="SBP"
                type="text"
                pattern="\d*"
                {...register('sbp')}
                width="half"
                className="col-span-1 max-w-[140px]"
              />
              <Input
                label="DBP"
                type="text"
                pattern="\d*"
                {...register('dbp')}
                width="half"
                className="col-span-1 max-w-[140px]"
              />
              <Input
                label="PR"
                type="text"
                pattern="\d*"
                {...register('pr')}
                width="half"
                className="col-span-1 max-w-[140px]"
              />
              <Input
                label="BT"
                type="text"
                pattern="\d*\.?\d*"
                {...register('bt')}
                width="half"
                className="col-span-1 max-w-[140px]"
              />
              <Input
                label="SPO2"
                type="text"
                pattern="\d*"
                {...register('spo2')}
                width="half"
                className="col-span-1 max-w-[140px]"
              />
              <Input
                label="BST"
                type="text"
                pattern="\d*"
                {...register('bst')}
                width="half"
                className="col-span-1 max-w-[140px]"
              />
              <Input
                label="보호자 연락처"
                {...register('guardianContact')}
                width="auto"
                className="col-span-1"
              />
            </div>

            {/* 증상 및 진단 섹션 */}
            <div className="space-y-4">
              <DispatchTextArea
                register={register('symptoms')}
                placeholder="증상 및 특이사항"
                className="h-20"
              />
              <DispatchTextArea
                register={register('medicalHistory')}
                placeholder="기저 질환"
                className="h-20"
              />
              <DispatchTextArea
                register={register('medications')}
                placeholder="복용 약물"
                className="h-20"
              />
              <DispatchTextArea
                register={register('reportSummary')}
                placeholder="신고 요약본"
                className="h-20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="gray" type="button">
              삭제
            </Button>
            <Button variant="blue" type="submit">
              저장
            </Button>
          </div>
        </form>
      </div>
    </DispatchMainTemplate>
  );
};

export default PatientInfoPage;
