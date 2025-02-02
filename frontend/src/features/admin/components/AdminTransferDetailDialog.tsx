import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TransferDetailProps } from '@features/admin/types/detailProps.types.ts';

const AdminTransferDetailDialog = ({ open, onOpenChange, data }: TransferDetailProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] w-[90%] max-h-[90vh] min-h-[400px] overflow-y-auto p-12 bg-bg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">이송 상세정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* 첫 번째 줄 */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label className="text-sm mb-1">환자</Label>
              <Input value={data.patient} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">성별</Label>
              <Input value={data.patientGender} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">나이</Label>
              <Input value={data.patientAge} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">pre-KTAS</Label>
              <Input value={data.preTKAS} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 두 번째 줄 */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label className="text-sm mb-1">관할 소방서</Label>
              <Input value={data.fireDept} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">출동 구급대원 1</Label>
              <Input value={data.fireStaffName} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">출동 구급대원 2</Label>
              <Input value={data.fireStaffName} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">출동 구급대원 3</Label>
              <Input value={data.fireStaffName} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 세번째 줄 */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label className="text-sm mb-1">이송 요청 시간</Label>
              <Input value={data.transferRequestAt} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">이송 수락 시간</Label>
              <Input value={data.transferAcceptAt} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">이송 완료 시간</Label>
              <Input value={data.transferArriveAt} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">이송 병원</Label>
              <Input
                value={data.hospitalName ? '이송' : '미이송'}
                readOnly
                className="bg-white border-none"
              />
            </div>
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

export default AdminTransferDetailDialog;
