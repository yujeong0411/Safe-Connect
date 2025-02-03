import {useState} from "react";
import VideoCall from "@components/organisms/VideoCall/VideoCall.tsx";
import TextArea from "@components/atoms/TextArea/TextArea.tsx";
import Button from "@components/atoms/Button/Button.tsx";

const ControlVideoForm = () => {
    const [reportText, setReportText] = useState('');

    const handleSaveReport = () => {
        console.log('Save report:', reportText);
    };

    return (
        <div className="h-screen w-full p-6">
            <div className="space-y-6">
                <VideoCall />
                <div>
                    <h3 className="text-lg font-semibold mb-2">신고 내용</h3>
                    <TextArea
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        placeholder="신고 내용을 입력하세요..."
                        className="mb-2"
                    />
                    <Button
                        variant="blue"
                        size="md"
                        width="auto"
                        onClick={handleSaveReport}
                    >
                        저장
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ControlVideoForm;
