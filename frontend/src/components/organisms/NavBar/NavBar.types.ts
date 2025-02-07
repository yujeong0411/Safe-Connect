// src/components/organisms/NavBar/NavBar.types.ts
export interface NavItem {
  label: string;
  path: string;
  active?: boolean;
  hasModal?: boolean;
  onModalOpen?: () => void;
}

export interface NavBarProps {
  navItems: NavItem[];
}