import { useForm } from 'react-hook-form';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import Input from '@/components/atoms/Input/Input';
import Button from '@/components/atoms/Button/Button';
import DispatchTextArea from '@/features/dispatch/components/DispatchTextArea';

interface PatientFormData {
  name: string;
  gender: string;
  age: string;
  patientContact: string;
  guardianContact: string;
  consciousness: string;
  preKTAS: string;
  sbp: string;
  dbp: string;
  pr: string;
  bt: string;
  spo2: string;
  bst: string;
  symptoms: string;
}

interface ReadOnlyPatientInfo {
  medicalHistory: string;
  medications: string;
  reportSummary: string;
}

const PatientInfoPage = () => {
  const {
    register,
    handleSubmit,
  } = useForm<PatientFormData>();

  // 상황실에서 전송받은 읽기 전용 데이터 (실제로는 props나 API로 받아올 것)
  const readOnlyInfo: ReadOnlyPatientInfo = {
    medicalHistory: "고혈압,",
    medications: "혈압약, 인슐린",
    reportSummary: "갑자기 가슴 통증을 호소하며 쓰러짐"
  };

  /* 나이 선택바 옵션 (필요시 사용)
  const ageGroups = [
    '10대 미만', '10대', '20대', '30대', '40대',
    '50대', '60대', '70대', '80대', '90대 이상',
  ];
  */

  const ktasOptions = ['1', '2', '3', '4', '5'];

  const onSubmit = (data: PatientFormData) => {
    console.log(data);
  };

  return (
    <DispatchMainTemplate>
      <div className="p-8 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 rounded-lg shadow-sm">
          {/* 기본 정보 섹션 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">기본 정보</h3>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-2">
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
                <Input
                    label="나이"
                    type="number"
                    {...register('age')}
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
              <div className="col-span-3">
                <Input
                    label="보호자 연락처"
                    {...register('guardianContact')}
                    width="full"
                />
              </div>
            </div>
          </div>

          {/* 생체 징후 섹션 */}
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 pt-2 border-b">생체 징후</h3>
              <div className="grid grid-cols-6 gap-3">
                <div className="col-span-1">
                  <Input
                      label="SBP"
                      type="text"
                      pattern="\d*"
                      {...register('sbp')}
                      width="full"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                      label="DBP"
                      type="text"
                      pattern="\d*"
                      {...register('dbp')}
                      width="full"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                      label="PR"
                      type="text"
                      pattern="\d*"
                      {...register('pr')}
                      width="full"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                      label="BT"
                      type="text"
                      pattern="\d*\.?\d*"
                      {...register('bt')}
                      width="full"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                      label="SPO2"
                      type="text"
                      pattern="\d*"
                      {...register('spo2')}
                      width="full"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                      label="BST"
                      type="text"
                      pattern="\d*"
                      {...register('bst')}
                      width="full"
                  />
                </div>
              </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <label className="block text-black text-sm font-medium mb-1">Pre-KTAS</label>
                <select
                    {...register('preKTAS')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {ktasOptions.map((ktas) => (
                      <option key={ktas} value={ktas}>{ktas}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <Input
                    label="mental"
                    {...register('consciousness')}
                    width="full"
                />
              </div>
            </div>

            {/* 상세 정보 섹션 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 pt-2 border-b">상세 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dialog_content p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">기저 질환</h4>
                  <p className="text-gray-900">{readOnlyInfo.medicalHistory}</p>
                </div>
                <div className="bg-dialog_content p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">복용 약물</h4>
                  <p className="text-gray-900">{readOnlyInfo.medications}</p>
                </div>
              </div>
            </div>


            <div className="bg-dialog_content p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">신고 요약본</h4>
              <p className="text-gray-900">{readOnlyInfo.reportSummary}</p>
            </div>
            <DispatchTextArea
                register={register('symptoms')}
                placeholder="증상 및 특이사항"
                className="h-24"
            />

            <div className="flex justify-end gap-4 pt-2">
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