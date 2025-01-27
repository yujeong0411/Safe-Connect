import { UserInfoHeaderProps } from '@features/user/types/UserInfoHeaderProps.tsx';

const UserInfoHeader = ({
  title,
  children,
  content,
  primaryButtonText,
  primaryButtonOnClick,
  secondaryButtonText,
  secondaryButtonOnClick,
}: UserInfoHeaderProps) => {
  return (
    <div className="w-[1440px] h-[900px] relative bg-[#f4f3f3]">
      <div className="w-[1440px] h-[900px] absolute left-0 top-0 bg-white">
        <div className="flex justify-start items-start w-[1440px] h-[900px] absolute left-0 top-0 overflow-hidden bg-[#f3f5f9]">
          <div
            className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[900px] w-[417px] overflow-hidden bg-white/0"
            style={{ boxShadow: '0px 0px 40px 0 rgba(177,187,208,0.15)' }}
          >
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 w-[417px] h-[900px] gap-[59px] px-[97.5px] pt-[67.75px]" />
          </div>
          <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-px h-[900px] gap-[119.7968521118164px] px-[95px] pt-[32.5px] bg-[#f3f5f9]" />
          <div className="flex-grow-0 flex-shrink-0 w-[250px] h-12 absolute left-[432px] top-[791px] rounded-lg bg-[#545f71]">
            <p className="absolute left-[107px] top-[12.45px] text-xl font-bold text-left text-white">
              {primaryButtonText}
            </p>
          </div>
          <div className="flex-grow-0 flex-shrink-0 w-[250px] h-12 absolute left-[712px] top-[791px] rounded-lg bg-[#ddd]">
            <p className="absolute left-[88px] top-[12.45px] text-xl font-bold text-left text-black">
              {secondaryButtonText}
            </p>
          </div>
        </div>
      </div>
      <p className="absolute left-[50px] top-[201px] text-[32px] font-medium text-center text-black">
        {title}
      </p>
      <div className="flex justify-center items-center w-[1440px] h-[115px] absolute left-0 top-[263px] gap-2.5 p-5 bg-white">
        {content}
      </div>
    </div>
  );
};

export default UserInfoHeader;
