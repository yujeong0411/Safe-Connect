import { NavBarProps } from '@components/organisms/NavBar/NavBar.types.ts';
import { Link } from 'react-router-dom';

const NavBar = ({ navItems }: NavBarProps) => {
  const handleClick = (item: NavBarProps['navItems'][0], e: React.MouseEvent) => {
    if (item.hasModal && item.onModalOpen) {
      e.preventDefault(); // 페이지 이동 방지
      item.onModalOpen(); // 모달 열기
    }
  };

  return (
    <nav className="w-flex h-[50px] relative">
      <div className="w-full h-full absolute bg-banner" />
      <div className=" h-full flex justify-center items-center space-x-[8rem]">
        {navItems.map((item, index) => (
          <Link
            // index를 추가하여 더 안전한 키 생성
            key={`${item.path}-${index}`}
            to={item.path}
            className="relative z-10 text-lg font-medium  text-white"
            onClick={(e) => handleClick(item, e)}
          >
            {item.label}
              {item.alarm !== undefined && item.alarm !== 0 && (
                  <span className="ml-2 bg-[#ED2B2A] text-white rounded-full px-[0.5rem] py-[0.2rem] text-xs">
                {item.alarm}
              </span>
              )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
