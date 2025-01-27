import { NavBarProps } from '@components/organisms/NavBar/NavBar.types.ts';
import { Link } from 'react-router-dom';

const NavBar = ({ navItems }: NavBarProps) => {
  return (
    <nav className="w-flex h-[50px] relative">
      <div className="w-full h-full absolute bg-[#545f71]" />
      <div className=" h-full flex justify-start items-center pl-20 gap-20">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className="relative z-10 text-lg font-medium text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
