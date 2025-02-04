import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogProps } from '../types/dialog.types';
import { usePatientStore } from '@/store/control/patientStore.tsx';
import { useCallListStore } from '@/store/control/callListStore.tsx';
import { useState } from 'react';

const ProtectorNotifyDialog = ({ open, onOpenChange }: DialogProps) => {
  const { sendProtectorMessage } = usePatientStore();
  const { callDetail } = useCallListStore();
  const [protectorPhone, setProtectorPhone] = useState('');

  const handleSendMessage = async () => {
    if (callDetail?.patientId) {
      const success = await sendProtectorMessage(callDetail.patientId);
      if (success) {
        onOpenChange(false); // 모달 닫기
      }
    }
  };

  // 메시지 내용 포맷팅
  const formatMessageContent = () => {
    if (!callDetail) return '';

    return `[Safe Connect] 응급 신고 접수 알림
[${callDetail.userName || '환자'}]님의 119 신고가 접수되었습니다.
- 신고 시각 : ${callDetail.callStartedAt ? new Date(callDetail.callStartedAt).toLocaleString() : '-'}
- 현재 상태 : ${callDetail.callIsDispatched ? '구급대원 출동 중' : '신고 접수'}

*안전을 최우선으로 합니다.`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-8 bg-bg">
        <h2 className="text-2xl font-bold mb-4">보호자 알림 전송</h2>

        <div className="space-y-6">
          <div>
            <p className="text-gray-600 mb-2">메세지</p>
            <div className="bg-gray-100 p-4 rounded-md mb-4 whitespace-pre-line">
              {formatMessageContent()}
            </div>
          </div>

          <div>
            <p className="mb-2">보호자 연락처</p>
            <Input
              type="tel"
              placeholder="010-0000-0000"
              className="bg-white mb-4"
              value={protectorPhone}
              onChange={(e) => setProtectorPhone(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-[#545f71] hover:bg-[#697383] text-white py-6"
            onClick={handleSendMessage}
          >
            전송
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProtectorNotifyDialog;
