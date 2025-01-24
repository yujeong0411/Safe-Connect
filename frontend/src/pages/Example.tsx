import Button from "@components/atoms/Button/Button.tsx";
import Alert from "@components/molecules/Alert/Alert.tsx"

const ExamplePage = () => {
    return (
        <div className="p-4 space-y-4">
            <div className="flex gap-2">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
            </div>
            <div className="flex gap-2">
                <Button variant="secondary" size="sm">Small</Button>
                <Button variant="secondary" size="md">Medium</Button>
                <Button variant="secondary" size="lg">Large</Button>
              <Button variant="primary" size="lg" onClick={() => console.log('클릭')}>
                큰 파란 버튼
              </Button>
            </div>
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
        </div>
    );
};

export default ExamplePage;