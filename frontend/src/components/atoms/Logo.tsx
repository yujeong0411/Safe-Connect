import mainLogo from '@assets/image/main_logo.png';

const Logo = () => {
  return (
    <img
      src={mainLogo}
      alt="safe connection"
      className="w-[3rem] md:w-[5rem] h-auto" // 모바일에서는 w-28(7rem), 태블릿 이상에서는 w-40(10rem)
    />
  );
};

export default Logo;
