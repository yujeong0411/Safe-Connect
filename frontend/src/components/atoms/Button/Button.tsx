// 버튼 컴포넌트의 props 타입 정의
interface ButtonProps {
  variant?: 'primary' | 'secondary';    // 버튼 스타일 종류 (기본값: primary)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // 버튼 크기 옵션 (기본값: md)
  children?: React.ReactNode;           // 버튼 내부 콘텐츠
  onClick?: () => void;                // 클릭 이벤트 핸들러
}

const Button = ({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) => {
  // 모든 버튼에 공통으로 적용되는 기본 스타일
  const baseStyle = "rounded-md transition-colors";  // 둥근 모서리, hover 시 부드러운 색상 전환

  // 버튼 종류별 스타일 정의
  const variantStyles = {
    primary: "bg-pink-500 hover:bg-pink-600 text-white",    // 파란색 배경, hover시 진한 파란색
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800" // 회색 배경, hover시 진한 회색
  };

  // 버튼 크기별 스타일 정의 (padding과 글자 크기)
  const sizeStyles = {
    xs: "px-2 py-1 text-xs",    // 가장 작은 크기
    sm: "px-3 py-1.5 text-sm",  // 작은 크기
    md: "px-4 py-2 text-base",  // 중간 크기 (기본)
    lg: "px-5 py-2.5 text-lg",  // 큰 크기
    xl: "px-6 py-3 text-xl"     // 가장 큰 크기
  };

  return (
      <button
          // 스타일들을 조합하여 적용
          className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]}`}
          onClick={onClick}
      >
        {children}
      </button>
  );
};

export default Button;