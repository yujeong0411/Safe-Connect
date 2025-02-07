export interface NavItem {
  label: string;
  path: string;
  active?: boolean;
  hasModal?: boolean;
  onModalOpen?: () => void;
}

export interface DispatchNavBarProps {
  navItems: NavItem[];
}