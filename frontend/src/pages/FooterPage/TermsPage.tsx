import MainTemplate from '@/components/templates/MainTemplate';

const TermsPage = ({ logoutDirect }: { logoutDirect: () => Promise<void> }) => {
    return (
        <MainTemplate
            navItems={[]}
            logoutDirect={logoutDirect || (async () => {})}
        >
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">이용약관</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">제1조 (목적)</h2>
                    <p className="mb-4">
                        이 약관은 Safe Connect(이하 "회사")가 제공하는 응급환자 정보 공유 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 사용자 간의 권리, 의무 및 책임 등 기본적인 사항을 규정하는 것을 목적으로 합니다.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">제2조 (정의)</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>"서비스"란 응급상황 발생 시 의료진과 사용자 간의 원활한 의사소통을 위해 회사가 제공하는 모든 서비스를 의미합니다.</li>
                        <li>"사용자"란 본 서비스를 이용하는 응급환자, 구급대원 및 관련 의료진을 의미합니다.</li>
                        <li>"환자정보"란 응급상황에서 의료진에게 제공되는 환자의 기본정보, 기저질환, 복용약물, 알레르기 등의 의료 관련 정보를 의미합니다.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">제3조 (서비스의 제공)</h2>
                    <p className="mb-4">회사가 제공하는 서비스는 다음과 같습니다:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>응급환자 정보 등록 및 관리 서비스</li>
                        <li>구급대원과 의료진 간의 실시간 정보 공유 서비스</li>
                        <li>영상통화를 통한 응급상황 대응 서비스</li>
                        <li>보호자 알림 서비스</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">제4조 (서비스 이용)</h2>
                    <p className="mb-4">
                        1. 사용자는 본 약관의 내용에 동의하고 회사가 제공하는 절차에 따라 서비스를 이용할 수 있습니다.
                    </p>
                    <p className="mb-4">
                        2. 사용자는 등록한 정보에 변경사항이 발생할 경우 즉시 수정해야 하며, 미수정으로 인한 문제는 사용자의 책임입니다.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">제5조 (의료정보의 보호)</h2>
                    <p className="mb-4">
                        1. 회사는 관련 법령에 따라 사용자의 의료정보를 보호하기 위해 보안 시스템을 구축하고 필요한 조치를 취합니다.
                    </p>
                    <p className="mb-4">
                        2. 등록된 의료정보는 응급상황에서 의료진에게만 제공되며, 그 외의 목적으로는 사용되지 않습니다.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">제6조 (회사의 의무)</h2>
                    <p className="mb-4">
                        1. 회사는 안정적인 서비스 제공을 위해 노력합니다.
                    </p>
                    <p className="mb-4">
                        2. 회사는 사용자의 개인정보 및 의료정보 보호를 위해 보안 체계를 갖추고 운영합니다.
                    </p>
                    <p className="mb-4">
                        3. 회사는 서비스 이용과 관련한 사용자의 불만사항이 정당하다고 인정될 경우 이를 신속하게 처리합니다.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">제7조 (책임의 한계)</h2>
                    <p className="mb-4">
                        1. 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 인한 서비스 제공 중단에 대해 책임을 지지 않습니다.
                    </p>
                    <p className="mb-4">
                        2. 사용자가 제공한 정보의 오류, 지연 등으로 인한 문제는 사용자의 책임입니다.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">제8조 (약관의 개정)</h2>
                    <p className="mb-4">
                        1. 회사는 필요한 경우 약관을 개정할 수 있으며, 개정된 약관은 서비스 화면에 공지함으로써 효력이 발생합니다.
                    </p>
                    <p className="mb-4">
                        2. 사용자는 개정된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.
                    </p>
                </section>
            </div>
        </MainTemplate>
    );
};

export default TermsPage;