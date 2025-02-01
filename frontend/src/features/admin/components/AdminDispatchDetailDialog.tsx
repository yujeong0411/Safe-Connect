import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@components/ui/textarea.tsx';
import { DispatchDetailProps } from '@features/admin/types/detailProps.types.ts';

const AdminDispatchDetailDialog = ({ open, onOpenChange, data, buttons }: DispatchDetailProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[90%] max-h-[90vh] min-h-[600px] overflow-y-auto p-12 bg-bg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">출동 상세정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* 첫 번째 줄 */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label className="text-sm mb-1">환자</Label>
              <Input value={data.patient} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">신고자</Label>
              <Input value={data.callerPhone} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">성별</Label>
              <Input value={data.patientGender} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">나이</Label>
              <Input value={data.patientAge} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 두 번째 줄 */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label className="text-sm mb-1">관할 소방서</Label>
              <Input value={data.fireDept} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">출동 구급대원1</Label>
              <Input value={data.fireStaffName} readOnly className="bg-white border-none" />
            </div>
            <div className="text-sm mb-1">
              <Label>출동 구급대원 2</Label>
              <Input value={data.fireStaffName} readOnly className="bg-white border-none" />
            </div>
            <div className="text-sm mb-1">
              <Label>출동 구급대원 3</Label>
              <Input value={data.fireStaffName} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 세번째 줄 */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label className="text-sm mb-1">출동 지령 일시</Label>
              <Input value={data.dispatchCreateAt} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">출동 일시</Label>
              <Input value={data.dispatchDepartAt} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">출동 종료 일시</Label>
              <Input
                value={data.dispatchArriveAt}
                readOnly
                className="bg-white border-none shadow-sm"
              />
            </div>
            <div>
              <Label className="text-sm mb-1">이송 여부</Label>
              <Input value={data.dispatchIsTransfer} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 네번째 줄 */}

          <div className="grid gap-4 flex-grow">
            <Label className="text-sm mb-1">출동 내용</Label>
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
export default AdminDispatchDetailDialog;
