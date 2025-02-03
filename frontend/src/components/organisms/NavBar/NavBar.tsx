import { NavBarProps } from '@components/organisms/NavBar/NavBar.types.ts';
import { Link } from 'react-router-dom';

const NavBar = ({ navItems }: NavBarProps) => {
    const handelClick = (item:NavBarProps['navItems'][0], e:React.MouseEvent) => {
        if (item.hasModal && item.onModalOpen) {
        e.preventDefault();  // 페이지 이동 방지
        item.onModalOpen();  // 모달 열기
        }
    }

  return (
    <nav className="w-flex h-[50px] relative">
      <div className="w-full h-full absolute bg-[#545f71]" />
      <div className=" h-full flex justify-start items-center pl-20 gap-20">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="relative z-10 text-lg font-medium text-white"
            onClick={(e) => handelClick(item, e)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
