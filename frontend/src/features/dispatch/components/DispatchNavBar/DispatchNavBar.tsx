import { DispatchNavBarProps } from './DispatchNavBar.types';
import { Link } from 'react-router-dom';
import { NavItem } from '@/components/organisms/NavBar/NavBar.types';

const DispatchNavBar = ({ navItems }: DispatchNavBarProps) => {
  const handleClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.hasModal && item.onModalOpen) {
      e.preventDefault();
      item.onModalOpen();
    }
  };

  return (
    <nav className="w-flex h-[43px] relative">
      <div className="w-full h-full absolute bg-banner" />
      <div className="h-full flex justify-start items-center p-5 md:pl-20 gap-10 md:gap-20">
        {navItems.map((item, index) => (
          <Link
            key={`${item.path}-${index}`}
            to={item.path}
            className="relative z-10 text-sm md:text-base font-medium  text-white"
            onClick={(e) => handleClick(item, e)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default DispatchNavBar;
