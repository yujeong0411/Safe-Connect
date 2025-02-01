import { ButtonProps } from '@components/atoms/Button/Button.types.ts';

const Button = ({
  variant = 'blue',
  size = 'md',
  width = 'full',
  children,
  onClick,
  type,
  className,
}: ButtonProps) => {
  // 모든 버튼에 공통으로 적용되는 기본 스타일
  const baseStyle = 'rounded-md transition-colors'; // 둥근 모서리, hover 시 부드러운 색상 전환

  // 버튼 종류별 스타일 정의
  const variantStyles = {
    blue: 'bg-[#545f71] hover:bg-[#697383] text-white', // 파란색 배경
    gray: 'bg-[#DDDDDD] hover:bg-[#ABABAB] text-gray-800', // 회색 배경
    red: 'bg-red-500 hover:bg-red-600 text-white',
  };

  // 버튼 크기별 스타일 정의 (padding과 글자 크기)
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs', // 가장 작은 크기
    sm: 'px-3 py-1.5 text-sm', // 작은 크기
    md: 'px-4 py-2 text-base', // 중간 크기 (기본)
    lg: 'px-5 py-2.5 text-lg', // 큰 크기
    xl: 'px-6 py-3 text-xl', // 가장 큰 크기
  };

  const widthStyles = {
    full: 'w-full', // 100%
    half: 'w-1/2', // 50%
    quarter: 'w-1/4', // 25%
    sm: 'w-1/6',
    auto: 'w-auto', // 자동
  };

  return (
    <button
      // 스타일들을 조합하여 적용
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles[width]} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
