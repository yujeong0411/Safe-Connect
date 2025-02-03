import ControlHalfTemplate from "@features/control/components/ControlHalfTemplate.tsx";
import MainTemplate from "@components/templates/MainTemplate.tsx";
import {useControlAuthStore} from "@/store/control/controlAuthStore.tsx";
import {useState} from "react";
import VideoCallCreateDialog from "@features/control/components/VideoCallCreateDialog.tsx";


const ControlMainPage = () => {
    const { logout } = useControlAuthStore();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const navItems = [
        {
            id: 'video',
            label: '영상통화 생성',
            path: '#',
            hasModal: true,
            onModalOpen: () => setIsVideoModalOpen(true)
        },
        { label: '신고 접수', path: '/control/test' },     // 경로 수정
        { label: '출동 지령', path: '/control/dispatch' },  // 경로 수정
        { label: '보호자 알림', path: '#' },
    ];

    return (
        <MainTemplate navItems={navItems} logoutDirect={logout}>
            <ControlHalfTemplate />
            <VideoCallCreateDialog
                open={isVideoModalOpen}
                onOpenChange={setIsVideoModalOpen}
            />
        </MainTemplate>
    );
};

export default ControlMainPage;
