import Dropdown from '@components/atoms/Dropdown/Dropdown.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useEffect } from 'react';
import { axiosInstance } from '@utils/axios.ts';

const SignupMediForm = () => {
  const {
    medicalHistoryOptions,
    medicationOptions,
    setMedicalHistoryOptions,
    setMedicationOptions,
    formData,
    setFormData,
  } = useSignupStore();

  useEffect(() => {
    const fetchMedicalData = async () => {
      const response = await axiosInstance.get('/user/medi/list');

      const medicalOptions = response.data.data.map((item) => ({
        value: item.mediId.toString(),
        label: item.mediName,
      }));

      setMedicalHistoryOptions(medicalOptions);
      setMedicationOptions(medicalOptions);
    };

    fetchMedicalData();
  }, []);

  return (
    <div>
      <div className="flex flex-row gap-10 p-10 w-full max-w-5xl mx-auto">
        {/*왼쪽*/}
        <div className="flex-1">
          <Dropdown
            label="현재 병력"
            options={medicalHistoryOptions}
            onChange={(value) => setFormData({ medicalHistory: value })}
          />
        </div>

        {/*오른쪽*/}
        <div className="flex-1">
          <Dropdown
            label="복용 약물"
            options={medicationOptions}
            onChange={(value) => setFormData({ medication: value })}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupMediForm;
