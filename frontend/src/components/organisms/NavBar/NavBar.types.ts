export interface NavItem {
  label: string;
  path: string;
  alarm?: string | number;   // 알림 배지 추가
  active?: boolean;
  hasModal?: boolean;
  onModalOpen?: () => void;
}

// MainTemaplte 타입 수정함.
export interface NavBarProps {
  navItems: NavItem[];
}