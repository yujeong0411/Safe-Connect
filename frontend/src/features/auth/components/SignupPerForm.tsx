import { SignupPerFormProps } from '@features/auth/types/SignupForm.types.ts';
import Checkbox from '@components/atoms/Checkbox/Checkbox.tsx';

const SignupPerForm = ({ isChecked, setIsChecked }: SignupPerFormProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-left w-full mb-10">개인정보 수집 및 이용 동의서</h1>
      <div className="bg-white rounded-xl p-10 w-full max-w-5xl mx-auto">
        <div className="space-y-10">
          <div>
            <ul className="text-lg font-bold mb-2">개인정보의 수집·이용 목적</ul>
            <li className="text-md">
              화재·구조·구급의 응급상황으로 119신고 시 신고자의 정보를 신속히 확인하고 출동 및
              대응시간을 최소화하기 위해 신고자정보 이용
            </li>
            <li className="text-md">
              safe connect에 등록한 정보를 119상황실, 출동하는 소방대원, 병원에게 제공
            </li>
          </div>
          <div>
            <ul className="text-lg font-bold mb-2">수집하려는 개인정보의 항목</ul>
            <li className="text-md">필수항목 : 주민등록번호 7자리, 이름, 전화번호, 이메일</li>
            <li className="text-md">
              선택항목 : 질병사항(과거질환, 현재질환, 복용약물), 기타 구급관련정보(특이체질 등),
              보호자 연락처
            </li>
          </div>
          <div>
            <ul className="text-lg font-bold mb-2">개인정보의 보유 및 이용 기간</ul>
            <li className="text-md">safe connect 서비스 회원 탈퇴 시 개인정보 삭제</li>
          </div>
          <p className="text-md">
            ※ 귀하는 safe connect 서비스에 작성한 개인정보의 수집·이용에 대해 거부하실 수 있으며
            다만 이 경우에는 회원 가입이 거부 될 수 있습니다.
          </p>

          <div className="flex items-center justify-center text-center">
            <Checkbox
              isChecked={isChecked}
              onChange={setIsChecked}
              label="본인은 위의 동의서 내용을 충분히 숙지하였으며, 신속·정확한 응급출동 서비스를 제공받기
            위해 개인정보를 수집·이용하는 것에 동의합니다."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignupPerForm;
