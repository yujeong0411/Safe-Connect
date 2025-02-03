import Input from '@components/atoms/Input/Input.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';

const UserFindEmailForm = () => {
  const { formData, setFormData } = useSignupStore();

  return (
    <div className="w-full flex flex-col justify-center items-center space-y-5 p-10">
      <Input
        label="이름"
        value={formData.userName}
        onChange={(e) => setFormData({ userName: e.target.value })}
        isRequired
      />
      <Input
        label="전화번호"
        value={formData.userPhone}
        onChange={(e) => setFormData({ userPhone: e.target.value })}
        isRequired
      />
    </div>
  );
};

export default UserFindEmailForm;
