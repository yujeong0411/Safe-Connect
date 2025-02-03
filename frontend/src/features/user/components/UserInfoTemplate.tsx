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
    <div className="flex flex-col flex-grow">
      <h2 className="pl-10 p-8  text-[32px] font-medium text-black">{title}</h2>

      {/* 내용 및 로고 */}
      <div className="flex justify-center items-center w-full h-[115px] p-10 bg-white">
        {content}
        {logoSrc && <img src={logoSrc} alt={logoAlt} className="ml-4 w-[90px] h-auto" />}
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col items-center  p-10 w-full">{children}</div>

      {/*버튼*/}
      <div className="flex justify-center gap-10 m-5">
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
