import { StepItemProps } from '@components/atoms/StepItem/StepItem.types.ts';

const StepItem = ({ number, title, description, isActive }: StepItemProps) => {
  return (
    <div className="flex items-center gap-2 md:gap-6 mb-4 md:mb-10">
      <div
          className={`w-[40px] md:w-[50px] h-[40px] md:h-[50px] rounded-full flex items-center justify-center
        ${isActive ? 'bg-banner text-white' : 'bg-[#e1f0ff] text-banner'}`}
      >
        <span className="text-base md:text-lg font-bold">{number}</span>
      </div>
      <div>
        <p className="text-lg md:text-xl font-bold text-[#181c32] mb-1">{title}</p>
        <p className="text-sm md:text-base text-[#b5b5c3]">{description}</p>
      </div>
    </div>
  );
};

export default StepItem;
