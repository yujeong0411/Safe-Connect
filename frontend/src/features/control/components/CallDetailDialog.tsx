import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EmergencyDetailProps } from '@/features/control/types/emergencyDetail.types';

const CallDetailDialog = ({ open, onOpenChange, data }: EmergencyDetailProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-[90%] max-h-[90vh] overflow-y-auto p-8 bg-bg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">신고 상세정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* 첫 번째 줄: 기본 정보 */}
          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label className="text-sm mb-1">이름</Label>
              <Input value={data.name} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">성별</Label>
              <Input value={data.gender} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">나이</Label>
              <Input value={data.age} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">신고자 연락처</Label>
              <Input value={data.patientPhone} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">신고 종료 일시</Label>
              <Input value={data.processTime} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 두 번째 줄: 증상 */}
          <div>
            <Label className="text-sm mb-1">증상</Label>
            <Input value={data.symptoms} readOnly className="bg-white border-none" />
          </div>

          {/* 세 번째 줄: 현재 병력 */}
          <div className="grid grid-cols-1">
            <div>
              <Label className="text-sm mb-1">현재 병력</Label>
              <Input value={data.currentDiseases} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 네 번째 줄: 복용 약물 */}
          <div className="grid grid-cols-1">
            <div>
              <Label className="text-sm mb-1">복용 약물</Label>
              <Input value={data.medications} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 다섯 번째 줄: 시간 정보 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm mb-1">신고 일시</Label>
              <Input value={data.reportTime} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">신고 종료 일시</Label>
              <Input value={data.processTime} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">출동 일시</Label>
              <Input value={data.dispatchTime} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 여섯 번째 줄: 요약본 */}
          <div>
            <Label className="text-sm mb-1">요약본</Label>
            <Input value={data.symptoms} readOnly className="bg-white border-none" />
          </div>

          {/* 닫기 버튼 */}
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} className="bg-banner" size="lg">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDetailDialog;