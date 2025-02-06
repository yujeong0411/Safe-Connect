import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogProps } from '../types/dialog.types';
import { useControlAuthStore } from '@/store/control/controlAuthStore.tsx';
import React, { useEffect } from 'react';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import { useVideoCallStore } from '@/store/control/videoCallStore.ts';
import { useNavigate } from 'react-router-dom';

const VideoCallCreateDialog = ({ open, onOpenChange }: DialogProps) => {
  const {
    sessionId,
    handleChangeSessionId,
    handleChangeUserName,
    createAndJoinSession
  } = useOpenViduStore();

  const navigate = useNavigate();
  const { setIsOpen } = useVideoCallStore();

  const {userName} = useControlAuthStore();


  useEffect(() => {
    // 세션 ID 자동 생성 (타임스탬프 + UUID)
    const timestamp = new Date().getTime();
    const sessionId = `${timestamp}-${userName}`;

    // 세션 ID 설정
    handleChangeSessionId({
      target: { value: sessionId }
    } as React.ChangeEvent<HTMLInputElement>);

    // 호스트 이름 설정
    handleChangeUserName({
      target: { value: `userName` }
    } as React.ChangeEvent<HTMLInputElement>);
  }, [handleChangeSessionId, handleChangeUserName]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAndJoinSession(e);
      const inviteUrl = `/openvidu/join/${sessionId}?direct=true`;
      await navigator.clipboard.writeText(window.location.origin + inviteUrl);
      onOpenChange(false)
      setIsOpen(true);
      navigate('/Control/patient-info')

    } catch (error) {
      console.error('세션 생성 실패:', error);
      alert('세션 생성에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-8 bg-bg">

        <DialogTitle className="text-2xl font-bold mb-8">영상통화 생성</DialogTitle>

        <div className="space-y-6">
          <div>
            <DialogDescription className="mb-2">
              신고자 전화번호
            </DialogDescription>
            <Input 
              type="tel" 
              placeholder="010-0000-0000" 
              className="bg-white" 
            />
          </div>
          
          <div className="flex justify-between gap-4">
            <Button 
              className="flex-1 bg-[#545f71] hover:bg-[#697383] text-white py-6"
              onClick={handleCreateSession}
            >
              영상통화방 생성 및 url전송
            </Button>
            <Button 
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-6"
              onClick={() => onOpenChange(false)}
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallCreateDialog;