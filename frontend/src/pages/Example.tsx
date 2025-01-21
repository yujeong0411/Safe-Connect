import Button from "@components/atoms/Button/Button.tsx";

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
            </div>
        </div>
    );
};

export default ExamplePage;