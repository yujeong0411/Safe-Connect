import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import { useForm } from 'react-hook-form';
import  Input from '@/components/atoms/Input/Input';
import Button from '@/components/atoms/Button/Button';
import  TextArea from '@/components/atoms/TextArea/TextArea';

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
              <Input
                label="이름"
                {...register('name')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="성별"
                {...register('gender')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="나이"
                type="number"
                {...register('age')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="의식상태"
                {...register('consciousness')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="pre-KTAS"
                type="number"
                {...register('preKTAS')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="환자 연락처"
                {...register('patientContact')}
                width="auto"
                className="col-span-1"
              />
            </div>

            {/* 생체 징후 섹션 */}
            <div className="grid grid-cols-6 gap-4 items-end mb-6">
              <Input
                label="SBP"
                type="number"
                {...register('sbp')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="DBP"
                type="number"
                {...register('dbp')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="PR"
                type="number"
                {...register('pr')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="BT"
                type="number"
                step="0.1"
                {...register('bt')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="SPO2"
                type="number"
                {...register('spo2')}
                width="auto"
                className="col-span-1"
              />
              <Input
                label="BST"
                type="number"
                {...register('bst')}
                width="auto"
                className="col-span-1"
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
              <TextArea
                value=""
                onChange={() => {}}
                placeholder="복통, 구토"
                className="h-20"
              />
              <TextArea
                value=""
                onChange={() => {}}
                placeholder="현재 병력을 입력하세요"
                className="h-20"
              />
              <TextArea
                value=""
                onChange={() => {}}
                placeholder="복용 중인 약물을 입력하세요"
                className="h-20"
              />
              <TextArea
                value=""
                onChange={() => {}}
                placeholder="노바스크 정 관련 정보를 입력하세요"
                className="h-20"
              />
            </div>

            <div className="mt-4">
              <Input
                label="신고 일시"
                value="2025-01-19 10:11"
                disabled
                width="auto"
              />
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