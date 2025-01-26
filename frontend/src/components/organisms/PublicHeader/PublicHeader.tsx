import { PublicHeaderProps } from '@components/organisms/PublicHeader/PublicHeader.types.ts';
import Logo from '@components/atoms/Logo.tsx';

const PublicHeader = ({ LinkLable, LinkHref }: PublicHeaderProps) => {
  return (
    <header className="relative justify-between items-center p-4">
      <Logo />
      <a href={LinkHref} className="text-[#3699ff]">
        {LinkLable}
      </a>
    </header>
  );
};

export default PublicHeader;
