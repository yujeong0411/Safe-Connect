import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CallRecord } from '@/types/control/ControlRecord.types.ts';
import { format } from 'date-fns'; // 날짜 포맷팅용 라이브러리

interface CallDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: CallRecord | null;
}

const CallDetailDialog = ({ open, onOpenChange, data }: CallDetailDialogProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] w-[90%] max-h-[90vh] overflow-y-auto p-8 bg-dialog_color">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">신고 상세내역</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>

        {/* 시간 정보 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm mb-1">신고 일시</Label>
            <div className="p-4 bg-dialog_content rounded-lg">
              {format(new Date(data.callStartedAt), 'yyyy-MM-dd HH:mm:ss')}
            </div>
          </div>
          <div>
            <Label className="text-sm mb-1">신고 종료 일시</Label>
            <div className="p-4 bg-dialog_content rounded-lg">
              {format(new Date(data.callFinishedAt), 'yyyy-MM-dd HH:mm:ss')}
            </div>
          </div>
          <div>
            <Label className="text-sm mb-1">출동 여부</Label>
            <div className="p-4 bg-dialog_content rounded-lg">
              {data.callIsDispatched ? '출동' : '미출동'}
            </div>
          </div>
        </div>

        {/* 여섯 번째 줄: 요약본 */}
        <div>
          <Label className="text-sm mb-1">요약본</Label>
          <div className="min-h-[100px] p-4 bg-dialog_content rounded-lg">{data.callSummary}</div>
        </div>
        <div>
          <Label className="text-sm mb-1">신고 내용</Label>
          <div className="min-h-[100px] p-4 bg-dialog_content rounded-lg">{data.callText}</div>
        </div>

        {/* 닫기 버튼 */}
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)} className="bg-banner" size="default">
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDetailDialog;
