// 버튼 컴포넌트의 props 타입 정의
interface ButtonProps {
  variant?: 'primary' | 'secondary'; // 버튼 스타일 종류 (기본값: primary)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // 버튼 크기 옵션 (기본값: md)
  children?: React.ReactNode; // 버튼 내부 콘텐츠
  onClick?: () => void; // 클릭 이벤트 핸들러
}
