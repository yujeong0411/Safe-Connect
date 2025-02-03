export interface NavBarProps {
  navItems: Array<{ label: string; path: string, hasModal?:boolean, onModalOpen?:() => void }>;
}
