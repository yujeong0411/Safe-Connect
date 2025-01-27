import { UserInfoTemplateProps } from '@features/user/types/UserInfoTemplateProps.tsx';
import Button from '@components/atoms/Button/Button.tsx';

const UserInfoTemplate = ({
  title,
  children,
  content,
  primaryButtonOnClick,
  secondaryButtonOnClick,
  logoAlt,
  logoSrc,
}: UserInfoTemplateProps) => {
  return (
    <div className="flex flex-col min-h-full relative overflow-hidden">
      <h2 className="pl-10 p-8  text-[32px] font-medium text-black">{title}</h2>
      <div className="flex justify-center items-center w-full h-[115px] relative p-10 bg-white">
        {content}
        {logoSrc && <img src={logoSrc} alt={logoAlt} className="ml-4 w-[90px] h-auto" />}
      </div>
      <div className="flex justify-center p-10">{children}</div>
      {/*버튼*/}
      <div className="flex justify-center gap-10 mt-10 mb-10 ">
        <Button variant="blue" size="md" width="sm" onClick={primaryButtonOnClick}>
          저장
        </Button>
        <Button variant="gray" size="md" width="sm" onClick={secondaryButtonOnClick}>
          회원 탈퇴
        </Button>
      </div>
    </div>
  );
};

export default UserInfoTemplate;
