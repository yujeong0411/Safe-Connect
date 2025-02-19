import MainTemplate from '@/components/templates/MainTemplate';

const PrivacyPage = ({ logoutDirect }: { logoutDirect: () => Promise<void> }) => {
    return (
        <MainTemplate
            navItems={[]}
            logoutDirect={logoutDirect || (async () => {})}
        >
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">개인정보처리방침</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">1. 개인정보의 수집 및 이용 목적</h2>
                    <p className="mb-4">
                        회사는 다음의 목적을 위하여 개인정보를 처리합니다. 수집된 개인정보는 다음의 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경될 시에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>응급상황 시 의료진에게 정확한 환자 정보 제공</li>
                        <li>구급대원과 의료진 간 응급환자 정보 공유</li>
                        <li>보호자 긴급 연락망 구축 및 운영</li>
                        <li>서비스 이용에 따른 본인 식별 및 인증</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">2. 수집하는 개인정보 항목</h2>
                    <p className="mb-4">회사는 다음과 같은 개인정보 항목을 수집합니다:</p>
                    <div className="pl-6">
                        <p className="font-medium mb-2">필수항목:</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>인적사항: 이름, 생년월일, 성별, 연락처</li>
                            <li>의료정보: 혈액형, 기저질환, 현재 복용중인 약물, 알레르기 정보</li>
                            <li>응급상황 발생 위치정보</li>
                        </ul>
                        <p className="font-medium mb-2">선택항목:</p>
                        <ul className="list-disc pl-6">
                            <li>보호자 정보: 이름, 연락처, 관계</li>
                            <li>기타 건강 관련 정보</li>
                        </ul>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">3. 개인정보의 보유 및 이용기간</h2>
                    <p className="mb-4">
                        회사는 원칙적으로 개인정보의 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 관련 법령에 따라 해당 기간 동안 보존합니다:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>의료법에 따른 진료기록부: 10년</li>
                        <li>응급의료에 관한 법률에 따른 이송기록: 5년</li>
                        <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">4. 개인정보의 제3자 제공</h2>
                    <p className="mb-4">
                        회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 응급상황 발생 시 아래와 같이 제공될 수 있습니다:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>제공받는 자: 응급의료기관, 구급대원</li>
                        <li>제공목적: 응급환자의 신속하고 적절한 치료</li>
                        <li>제공정보: 환자의 기본정보, 의료정보</li>
                        <li>보유기간: 응급상황 종료 시까지</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">5. 개인정보의 안전성 확보 조치</h2>
                    <p className="mb-4">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>관리적 조치: 내부관리계획 수립 및 시행, 정기적 직원 교육</li>
                        <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                        <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">6. 정보주체의 권리와 의무</h2>
                    <p className="mb-4">
                        정보주체는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>개인정보 열람 요구</li>
                        <li>오류 등이 있을 경우 정정 요구</li>
                        <li>삭제 요구</li>
                        <li>처리정지 요구</li>
                    </ul>
                </section>
            </div>
        </MainTemplate>
    );
};

export default PrivacyPage;