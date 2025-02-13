import {useEffect, useState} from 'react';
import {DispatchData} from "@features/dispatch/types/types.ts";
import {useDispatchData} from "@features/dispatch/hooks/useDispatchData";
import DispatchMainTemplate from "@features/dispatch/components/DispatchMainTemplate.tsx";
import {Alert, AlertDescription, AlertTitle} from "@components/ui/alert.tsx";
import DispatchTable from "@components/molecules/DispatchTable/DispatchTable.tsx";
import TransferDetailDialog from "@features/dispatch/components/TransferDetailDialog.tsx";

const DispatchList = () => {
    const [selectedDispatch, setSelectedDispatch] = useState<DispatchData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { data, totalPages, loading } = useDispatchData(currentPage);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        description: "",
        type: "default" as "default" | "destructive",
    });


    // 알림 처리 함수
    const handleAlertClose = (config: typeof alertConfig) => {
        setAlertConfig(config);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 10000);
    }

    useEffect(() => {
        const dispatchLoginId = localStorage.getItem("userName");
        if (!dispatchLoginId) {
            console.log("구급팀 정보가 없습니다.");
            return;
        }

        let subscribeUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        if (subscribeUrl !== "http://localhost:8080") {
            subscribeUrl += "/api"
        }

        // SSE 연결
        const eventSource = new EventSource(`${subscribeUrl}/dispatchGroup/subscribe?clientId=${dispatchLoginId}`);


        // 메시지 수신 처리
        eventSource.onmessage = (event) => {
            const response: DispatchOrderResponse = JSON.parse(event.data);
            if (response.isSuccess) {
                handleAlertClose({
                    title: "출동 지령 도착",
                    description: `출동 지령이 도착했습니다. (신고 ID: ${response.data.callId}`,
                    type: "default"
                });
            } else {
                handleAlertClose({
                    title: "출동 지령 수신 실패",
                    description: response.message || "출동 지령 수신에 실패했습니다",
                    type: "destructive"
                });
            }
        };

        // 에러 처리
        eventSource.onerror = (error) => {
            console.error("SSE 연결 에러: ", error);
            eventSource.close();
        };

        // 컴포넌트 언마운트 시 연결 종료
        return () => {
            eventSource.close();
        };
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    return (
        <DispatchMainTemplate>
            {/* Alert UI */}
            {showAlert && (
                <div className="fixed left-1/2 top-80 -translate-x-1/2 z-50">
                    <Alert
                        variant={alertConfig.type}
                        className={`w-[400px] shadow-lg bg-white ${
                            alertConfig.type === 'default'
                                ? '[&>svg]:text-blue-600 text-blue-600'
                                : '[&>svg]:text-red-500 text-red-500'
                        }`}
                    >
                        <AlertTitle className="text-lg ml-2">{alertConfig.title}</AlertTitle>
                        <AlertDescription className="text-sm m-2">
                            {alertConfig.description}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">출동 현황</h1>
                {loading ? (
                    <div>로딩중...</div>
                ) : (
                    <DispatchTable
                        data={data}
                        onRowClick={setSelectedDispatch}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        totalPages={totalPages}
                    />
                )}
                {selectedDispatch && (
                    <TransferDetailDialog
                        open={!!selectedDispatch}
                        onClose={() => setSelectedDispatch(null)}
                        data={selectedDispatch}
                    />
                )}
            </div>
        </DispatchMainTemplate>
    );
};

export default DispatchList;
