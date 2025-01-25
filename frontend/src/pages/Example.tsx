import Button from '@components/atoms/Button/Button';
// import Alert from "@components/molecules/Alert/Alert";
import Input from '@components/atoms/Input/Input';
import Pagination from '@components/atoms/Pagination/Pagination';
import Dropdown from '@components/atoms/Dropdown/Dropdown';
// import Icon from '@components/atoms/Icon/Icon';

const ExamplePage = () => {
  return (
    <div className="p-4 space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Buttons</h2>
        <div className="flex gap-2">
          <Button variant="blue" size="sm">
            Small
          </Button>
          <Button variant="blue" size="md">
            Medium
          </Button>
          <Button variant="red" size="lg">
            Large
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="gray" size="sm">
            Small
          </Button>
          <Button variant="gray" size="md">
            Medium
          </Button>
          <Button variant="blue" size="lg">
            Large
          </Button>
          <Button variant="red" size="lg" onClick={() => console.log('클릭')}>
            큰 파란 버튼
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Inputs</h2>
        <div className="space-y-4">
          <Input label="기본 입력" placeholder="텍스트를 입력하세요" width="quarter" />
          <Input
            label="에러 상태"
            variant="error"
            helperText="필수 입력 항목입니다"
            isRequired
            width="half"
          />
          <Input label="큰 사이즈" inputSize="lg" width="half" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Pagination</h2>
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={(page) => console.log(`페이지 ${page}로 이동`)}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Dropdown</h2>
        <div className="max-w-xs">
          <Dropdown
            label="선택"
            options={[
              { value: 'option1', label: '옵션 1' },
              { value: 'option2', label: '옵션 2' },
              { value: 'option3', label: '옵션 3' },
            ]}
            onChange={(value) => console.log('선택된 값:', value)}
          />
        </div>
      </section>
      {/*<section className="space-y-4">*/}
      {/*  <h2 className="text-xl font-bold">Icons</h2>*/}
      {/*  <div className="flex gap-4 items-center">*/}
      {/*    <Icon name="Heart" size="sm" color="error" />*/}
      {/*    <Icon name="AlertCircle" size="md" color="warning" />*/}
      {/*    <Icon name="CheckCircle" size="lg" color="success" />*/}
      {/*    <Icon name="User" color="primary" />*/}
      {/*    <Icon name="Settings" color="secondary" />*/}
      {/*  </div>*/}
      {/*</section>*/}
      {/* <section>
                <h2 className="text-xl font-bold">Alert</h2>
                <div className="flex gap-2">
                    <Alert
                        isOpen={true}
                        onClose={() => {}}
                        title="회원 탈퇴"
                        message="정말 탈퇴하시겠습니까?"
                        buttons={[
                            {
                                text: "확인",
                                variant: "primary",
                                onClick: () => {}
                            },
                            {
                                text: "취소",
                                variant: "secondary",
                                onClick: () => {}
                            }
                        ]}
                    />
                </div>
            </section> */}
    </div>
  );
};

export default ExamplePage;
