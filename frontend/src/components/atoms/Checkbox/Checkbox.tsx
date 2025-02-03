import { CheckboxProps } from '@components/atoms/Checkbox/Checkbox.types.ts';

const Checkbox = ({ isChecked = false, onChange, label }: CheckboxProps) => {
  return (
    <label className="flex items-start cursor-pointer gap-3">
      <div
        className={`min-w-[20px] min-h-[20px] mt-1 rounded border flex-shrink-0 flex justify-center items-center ${
          isChecked ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400 text-transparent'
        }`}
        onClick={() => onChange?.(!isChecked)}
      >
        {isChecked && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {label && <span className="text-lg">{label}</span>}
    </label>
  );
};

export default Checkbox;
