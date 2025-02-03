import Dropdown from '@components/atoms/Dropdown/Dropdown.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useCallback, useEffect } from 'react';
import { fetchMedicalData } from '@features/auth/servies/apiService.ts';

const SignupMediForm = () => {
  const {
    diseaseOptions,
    medicationOptions,
    setDiseaseOptions,
    setMedicationOptions,
    formData,
    setFormData,
  } = useSignupStore();

  const loadMedicalData = useCallback(async () => {
    try {
      const data = await fetchMedicalData();
      console.log('받아온 의료 데이터:', data);

      setDiseaseOptions(data.diseaseOptions);
      setMedicationOptions(data.medicationOptions);
      console.log('의료정보 전체 조회 성공');
    } catch (error) {
      console.error('의료 데이터 가져오기 실패:', error);
      alert('의료 데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  }, [setDiseaseOptions, setMedicationOptions]); // 의존성 추가

  useEffect(() => {
    // void 연산자로 프로미스 반환 무시
    void loadMedicalData();
  }, [loadMedicalData]); // loadMedicalData를 의존성으로 추가

  // 스토어의 상태를 모니터링하기 위한 별도의 useEffect
  useEffect(() => {
    console.log('store 상태:', { diseaseOptions, medicationOptions });
  }, [diseaseOptions, medicationOptions]);

  return (
    <div className="flex flex-row gap-x-20 w-full min-h-full">
      {/*왼쪽*/}
      <div className=" w-1/2 h-auto max-w-[50%]">
        <Dropdown
          label="현재 병력"
          options={diseaseOptions}
          value={formData.diseaseId || []} // 훅에서 가져온 데이터 전달
          placeholder="현재 앓고 계신 질환을 추가하세요."
          onChange={(value: number[]) => {
            // 타입을 number[]로 명시
            setFormData({
              ...formData,
              diseaseId: value,
            });
          }}
        />
      </div>

      {/*오른쪽*/}
      <div className="w-1/2 h-auto max-w-[50%]">
        <Dropdown
          label="복용 약물"
          options={medicationOptions}
          value={formData.medicationId || []}
          placeholder="복용하고 있는 약물을 추가하세요."
          onChange={(value: number[]) => {
            // 타입을 number[]로 명시
            setFormData({
              ...formData,
              medicationId: value,
            });
          }}
        />
      </div>
    </div>
  );
};

export default SignupMediForm;
