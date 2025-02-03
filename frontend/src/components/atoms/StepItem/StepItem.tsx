import { StepItemProps } from '@components/atoms/StepItem/StepItem.types.ts';

const StepItem = ({ number, title, description, isActive }: StepItemProps) => {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div
        className={`w-[50px] h-[50px] rounded-full flex items-center justify-center
     ${isActive ? 'bg-[#545f71] text-white' : 'bg-[#e1f0ff] text-[#3f4254]'}`}
      >
        <span className="text-lg font-bold">{number}</span>
      </div>
      <div>
        <p className="text-lg font-bold text-[#181c32]">{title}</p>
        <p className="text-sm text-[#b5b5c3]">{description}</p>
      </div>
    </div>
  );
};

export default StepItem;
