import StepItem from '@components/atoms/StepItem/StepItem.tsx';

const SignupProgress = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    {
      number: 1,
      title: '개인정보 제공 동의',
      description: '개인정보 제공에 동의합니다.',
      isActive: currentStep >= 1,
    },
    {
      number: 2,
      title: '기본 정보 입력',
      description: '사용자의 기본정보를 입력합니다.',
      isActive: currentStep >= 2,
    },
    {
      number: 3,
      title: '회원가입',
      description: '필수 정보 확인 후 회원가입합니다.',
      isActive: currentStep >= 3,
    },
    {
      number: 4,
      title: '의료 정보 입력',
      description: '필요시 사용자의 의료정보를 입력합니다.',
      isActive: currentStep >= 4,
    },
  ];
  return (
    <div className="flex flex-col gap-4 md:gap-[39px]">
      {steps.map((step) => (
        <StepItem key={step.number} {...step} isActive={step.number === currentStep} />
      ))}
    </div>
  );
};

export default SignupProgress;
