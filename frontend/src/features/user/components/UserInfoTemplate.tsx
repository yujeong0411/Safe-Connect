import { UserInfoTemplateProps } from '@features/user/types/UserInfoTemplateProps.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import ConfirmDialog from '@components/organisms/ConfirmDialog/ConfirmDialog.tsx';

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
      <h2 className="pl-10 p-5 text-[23px] font-medium text-black">{title}</h2>

      {/* 내용 및 로고 */}
      <div className="flex justify-center items-center w-full h-[105px] p-8 bg-white text-center text-[13px] md:text-[17px]">
        {content}
        {logoSrc && (
          <img src={logoSrc} alt={logoAlt} className="ml-4 w-[55px] md:w-[80px] h-auto" />
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col items-center p-10 w-full">{children}</div>

      {/*버튼*/}
      <div className="flex flex-wrap justify-center items-center gap-5 w-full mx-auto px-5 py-2">
        <Button
          variant="blue"
          width="sm"
          className="w-[100px] h-10 text-base md:w-[240px]"
          onClick={primaryButtonOnClick}
        >
          수정
        </Button>
        {secondaryButtonOnClick && (
          <ConfirmDialog
            trigger="회원 탈퇴"
            title="회원 탈퇴"
            description={
              <>
                정말로 탈퇴하시겠습니까? <br/>
                <span className="text-red-500">
                  탈퇴 시 모든 개인정보와 의료정보가 삭제됩니다. <br/>
                </span>
                삭제된 정보는 복구할 수 없으며, 서비스를 다시 이용하시려면 재가입이 필요합니다.
              </>
            }
            confirmText="탈퇴"
            cancelText="취소"
            triggerVariant="gray"
            className=" h-10 text-base sm:w-[100px] lg:w-[240px]"
            onConfirm={secondaryButtonOnClick}
          />
        )}
      </div>
    </div>
  );
};

export default UserInfoTemplate;
