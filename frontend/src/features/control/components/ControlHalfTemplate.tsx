import ControlVideoForm from "@features/control/components/ControlVideoForm.tsx";
import {Routes, Route} from "react-router-dom";
import ControlLogPage from "@pages/ControlPage/ControlLogPage.tsx";
import DispatchPage from "@pages/ControlPage/DispatchPage.tsx";

const ControlHalfTemplate = () => {
    return (
        <div className="flex w-full h-[calc(100vh-120px)]">
            {/* 왼쪽 고정 페이지 */}
            <div className="w-1/2 h-full border-r">
                <ControlVideoForm />
            </div>

            {/* 오른쪽 변경 페이지 */}
            <div className="w-1/2 h-full">
                <Routes>
                    <Route path="/logs" element={<ControlLogPage/>} />
                    <Route path="/dispatch" element={<DispatchPage/>} />{/* 경로 수정 */}
                </Routes>
            </div>
        </div>
    );
};

export default ControlHalfTemplate;
