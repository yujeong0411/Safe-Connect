// 버튼 컴포넌트의 props 타입 정의
export interface ButtonProps {
  variant?: 'blue' | 'gray' | 'red'; // 버튼 스타일 종류 (기본값: blue)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // 버튼 크기 옵션 (기본값: md)
  width?: 'full' | 'half' | 'quarter' | 'auto';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode; // 버튼 내부 콘텐츠
  onClick?: () => void; // 클릭 이벤트 핸들러
}
