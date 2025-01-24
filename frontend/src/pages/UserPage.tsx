// pages/UserPage.tsx
import { useState } from 'react';
import { Dialog } from '@components/molecules/Alert/Alert.tsx';

export const UserPage = () => {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <div>
            <button onClick={() => setShowDialog(true)}>
                회원 탈퇴 버튼
            </button>

            {showDialog && (
                <Dialog
                    title="회원 탈퇴 하시겠습니까?"
                    message="회원 탈퇴 시 계정을 복구할 수 없습니다."
                    buttons={[
                        {
                            text: "회원 탈퇴",
                            variant: "primary",
                            onClick: () => console.log("탈퇴")
                        },
                        {
                            text: "취소",
                            variant: "secondary",
                            onClick: () => setShowDialog(false)
                        }
                    ]}
                />
            )}
        </div>
    );
};