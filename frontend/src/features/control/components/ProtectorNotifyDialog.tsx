import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogProps } from '../types/dialog.types';
import { usePatientStore } from '@/store/control/patientStore.tsx';

const ProtectorNotifyDialog = ({ open, onOpenChange }: DialogProps) => {
  const { sendProtectorMessage, patientInfo } = usePatientStore();

  const handleSendMessage = async () => {
    if (patientInfo?.userPhone) {
      const success = await sendProtectorMessage(patientInfo.userPhone);
      if (success) {
        onOpenChange(false); // 모달 닫기
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-8 bg-bg">
        <h2 className="text-2xl font-bold mb-4">보호자 알림 전송</h2>

        <div className="space-y-6">
          <div>
            <p className="text-gray-600 mb-2">내용</p>
            <div className="bg-gray-100 p-4 rounded-md mb-4 whitespace-pre-line">
              [Safe Connect] 응급 신고 접수 알림 [{patientInfo?.userName || '환자'}]님의 119 신고가
              접수되었습니다.
            </div>
          </div>

          <Button
            className="w-full bg-banner hover:bg-[#697383] text-white py-6"
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
