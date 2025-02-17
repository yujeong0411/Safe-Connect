import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@components/ui/dialog.tsx';
import { Button } from '@components/ui/button.tsx';
import { Video, User } from 'lucide-react';

interface DispatchNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoCall: () => void;
  onPatientInfo: () => void;
}

const DispatchNotificationDialog = ({
                                      open,
                                      onOpenChange,
                                      onVideoCall,
                                      onPatientInfo
                                    }: DispatchNotificationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-8 bg-dialog_color">
        <DialogTitle className="text-2xl font-bold mb-2">출동 지령 도착</DialogTitle>

          <DialogDescription className="mb-6 text-lg">
            새로운 출동 지령이 도착했습니다.
          </DialogDescription>

          <div className="flex justify-between gap-4">
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-6 text-base"
            onClick={onVideoCall}
            >
            <Video className="mr-2 h-5 w-5" />
              영상통화 시작
          </Button>
          <Button
          className="flex-1 bg-white hover:bg-gray-50 text-blue-500 border-2 border-blue-500 py-6 text-base"
          onClick={onPatientInfo}
          >
          <User className="mr-2 h-5 w-5" />
            환자정보 확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchNotificationDialog;