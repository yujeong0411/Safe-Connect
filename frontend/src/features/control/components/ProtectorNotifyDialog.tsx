import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
      <DialogContent className="max-w-[600px] p-8 bg-dialog_color">
        <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-4">보호자 알림 전송</DialogTitle>
          </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-2">메세지</p>
            <div className="bg-[#EBEDF3] p-5 rounded-md mb-2 whitespace-pre-line">
              [Safe Connect] 응급 신고 접수 알림 <br/>
              <br/>
              [{patientInfo?.userName || '환자'}]님의 119 신고가 접수되었습니다.<br/>
              ▪️신고 시각 : 2024.01.17 14:30<br/>
              ▪️현재 상태 : 구급대원 출동 중<br/>
              <br/>
              *환자의 위치로 이동 중이신 경우, 안전운전 바랍니다.<br/>
              *Safe Connect이 최선을 다해 환자를 지원하고 있습니다.
            </div>
          </div>

          <Button
            className="w-full bg-banner hover:bg-[#697383] text-white text-md py-6"
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
