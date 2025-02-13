import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogProps } from '../types/dialog.types';
import { useControlAuthStore } from '@/store/control/controlAuthStore.tsx';
import React, { useEffect, useState } from 'react';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import { useVideoCallStore } from '@/store/control/videoCallStore.ts';
import { useNavigate } from 'react-router-dom';
import {formatPhoneNumber} from "@features/auth/servies/signupService.ts";

import useRecorderStore from '@/store/openvidu/MediaRecorderStore.tsx';

const VideoCallCreateDialog = ({ open, onOpenChange }: DialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const {
    // sessionId,
    handleChangeSessionId,
    handleChangeUserName,
    createAndJoinSession
  } = useOpenViduStore();

  const navigate = useNavigate();
  const { setIsOpen } = useVideoCallStore();
  const {userName} = useControlAuthStore();

  const { startRecording, initializeRecorder } = useRecorderStore();


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

  // 컴포넌트가 마운트될 때 레코더 초기화
  useEffect(() => {
    initializeRecorder();
  }, [initializeRecorder]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAndJoinSession(e,phoneNumber); //반드시 커밋전, 주석 풀것
      console.log("세션 생성 성공");
       // 녹화 시작
      startRecording(); 
      console.log("녹화 시작 호출 끝");
      // const inviteUrl = `/caller/join/${sessionId}?direct=true`;
      // await navigator.clipboard.writeText(window.location.origin + inviteUrl);
      onOpenChange(false)
      setIsOpen(true);

      navigate('/Control/patient-info')

    

    } catch (error) {
      console.error('세션 생성 실패:', error);
      alert('세션 생성에 실패했습니다.');
    }
  };

  // 전화번호 포맷팅
  const handleFormatPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedNumber = formatPhoneNumber(value);
    setPhoneNumber(formattedNumber);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-8 bg-dialog_color">

        <DialogTitle className="text-2xl font-bold mb-2">영상통화 생성</DialogTitle>

        <div className="space-y-6">
          <div>
            <DialogDescription className="mb-2">
              신고자 전화번호
            </DialogDescription>
            <Input 
              type="tel" 
              placeholder="010-0000-0000" 
              className="bg-dialog_content"
              value={phoneNumber}
              onChange={handleFormatPhone}
            />
          </div>
          
          <div className="flex justify-between gap-4">
            <Button 
              className="flex-1 bg-banner hover:bg-[#697383] text-white py-[1.4rem] text-[0.9rem]"
              onClick={handleCreateSession}
            >
              영상통화 생성
            </Button>
            <Button 
              className="flex-1 bg-graybtn hover:bg-gray-300 text-gray-800 py-[1.4rem] text-[0.9rem]"
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