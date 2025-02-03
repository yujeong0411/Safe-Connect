import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Button } from '@components/ui/button';
import { Textarea } from '@components/ui/textarea.tsx';
import { ReportDetailProps } from '@features/admin/types/detailProps.types.ts';

const AdminReportDetailDialog = ({ open, onOpenChange, data }: ReportDetailProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] w-[90%] max-h-[90vh] min-h-[500px] overflow-y-auto p-12 bg-bg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">신고 상세정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* 첫 번째 줄 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm mb-1">신고자</Label>
              <Input value={data.callerPhone} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">신고 일시</Label>
              <Input value={data.callStartAt} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">신고 종료 일시</Label>
              <Input value={data.callFinishAt} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 두 번째 줄 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm mb-1">상황실 직원</Label>
              <Input value={data.fireStaffName} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">출동 여부</Label>
              <Input
                value={data.callIsDispatch ? '출동' : '미출동'}
                readOnly
                className="bg-white border-none"
              />
            </div>
            <div className="text-sm mb-1">
              <Label>신고자 가입여부</Label>
              <Input
                value={data.callerIsUser ? '가입' : '미가입'}
                readOnly
                className="bg-white border-none"
              />
            </div>
          </div>

          {/* 세번째 줄 */}

          <div>
            <Label className="text-sm mb-1">신고 내용</Label>
            <Textarea
              value={data.callSummery}
              readOnly
              className="bg-white border-none h-[100px]"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2 mt-6 ml-5 h-10">
            <Button onClick={() => onOpenChange(false)} className="bg-banner" size="lg">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AdminReportDetailDialog;
