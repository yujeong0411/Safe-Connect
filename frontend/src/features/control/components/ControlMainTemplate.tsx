import React from 'react';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader';
import NavBar from '@components/organisms/NavBar/NavBar';
import VideoCallDrawer from './VideoDrawer';
import { useVideoCallStore } from '@/store/control/videoCallStore';
import VideoCallCreateDialog from "@features/control/components/VideoCallCreateDialog";
import ProtectorNotifyDialog from "@features/control/components/ProtectorNotifyDialog";
import {useControlAuthStore} from "@/store/control/controlAuthStore.tsx";
import {useNavigate} from "react-router-dom";

interface ControlTemplateProps {
    children?: React.ReactNode;
}

const ControlTemplate = ({ children }: ControlTemplateProps) => {
    const { setIsOpen } = useVideoCallStore();
    const navigate = useNavigate();
    const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
    const [isNotifyModalOpen, setIsNotifyModalOpen] = React.useState(false);
    const {logout} = useControlAuthStore()

    const handleLogout = async () => {
        try {
            await logout()
            navigate("/control/login");
        } catch (error) {
            console.error('로그아웃 실패', error);
        }
    };

    const navItems = [
        { label: '영상 URL 생성', path: '#', hasModal: true, onModalOpen: () => setIsVideoModalOpen(true) },
        {label: '전화 업무', path:'#', hasModal: true, onModalOpen:() => setIsOpen(true)},
        { label: '신고 업무', path: '/Control/patient-info' },
        { label: '출동 지령', path: '/Control/dispatch-order' },
        { label: '보호자 알림', path: '#', hasModal: true, onModalOpen: () => setIsNotifyModalOpen(true) },
        { label: '신고 목록', path: '/Control/main' },
    ];

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            <div className="-space-y-4">
                <PublicHeader
                    labels={[
                        {
                            label: '로그아웃',
                            href: '#',
                            onClick: handleLogout,
                        },
                    ]}
                />
                <NavBar navItems={navItems}/>
            </div>
            <div className="flex-1">
                <VideoCallDrawer>
                    {children}
                </VideoCallDrawer>
            </div>
            <VideoCallCreateDialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}/>
            <ProtectorNotifyDialog open={isNotifyModalOpen} onOpenChange={setIsNotifyModalOpen}/>
        </div>
    );
};

export default ControlTemplate;