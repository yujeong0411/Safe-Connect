import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PatientDetailProps } from '@features/hospital/types/patientDetail.types.ts';

const HospitalDetailDialog = ({ open, onOpenChange, data }: PatientDetailProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[80%] max-h-[90vh] min-h-[600px] overflow-y-auto p-8 bg-bg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">이송 상세정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* 첫 번째 줄 */}
          <div className="grid grid-cols-6 gap-4">
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
              <Label className="text-sm mb-1">의식상태</Label>
              <Input value={data.mental} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1 text-red-600">pre-KTAS</Label>
              <Input value={data.preKTAS} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">환자 연락처</Label>
              <Input value={data.phone} readOnly className="bg-white border-none" />
            </div>
          </div>

          {/* 두 번째 줄 : 생체 징후 */}
          <div className="grid grid-cols-7 gap-4">
            <div>
              <Label className="text-sm mb-1">SBP</Label>
              <Input value={data.sbp} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">DBP</Label>
              <Input value={data.dbp} readOnly className="bg-white border-none" />
            </div>
            <div className="text-sm mb-1">
              <Label> PR</Label>
              <Input value={data.pr} readOnly className="bg-white border-none" />
            </div>
            <div className="text-sm mb-1">
              <Label>BT</Label>
              <Input value={data.bt} readOnly className="bg-white border-none" />
            </div>
            <div className="text-sm mb-1">
              <Label>SPO2</Label>
              <Input value={data.spo2} readOnly className="bg-white border-none" />
            </div>
            <div className="text-sm mb-1">
              <Label>BST</Label>
              <Input value={data.bst} readOnly className="bg-white border-none" />
            </div>
            <div>
              <Label className="text-sm mb-1">보호자 연락처</Label>
              <Input
                value={data.protectorPhone}
                readOnly
                className="bg-white border-none shadow-sm w-full"
              />
            </div>
          </div>

          {/* 세번째 줄 : 증상 및 사진 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 왼쪽: 증상 정보들 */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-1">증상</Label>
                <Input value={data.symptoms} readOnly className="bg-white border-none" />
              </div>

              {/* 현재 병력 */}
              <div>
                <Label className="text-sm mb-1">현재 병력</Label>
                <Input value={data.diseases} readOnly className="bg-white border-none" />
              </div>

              {/* 복용 약물 */}
              <div>
                <Label className="text-sm mb-1">복용 약물</Label>
                <Input
                  value={data.medications}
                  readOnly
                  className="bg-white border-none shadow-sm"
                />
              </div>
            </div>

            {/* 오른쪽: 이미지 */}
            <div>
              <Label className="text-sm mb-1">첨부 사진</Label>
              <div className="bg-white h-[222px] rounded-md shadow-sm flex items-center justify-center text-gray-400">
                이미지 사진
              </div>
            </div>
          </div>

          {/* 하단 시간 정보와 버튼 영역 */}
          <div className="flex justify-between">
            <div className="grid grid-cols-4 gap-4 flex-grow">
              <div>
                <Label className="text-sm mb-1">이송 요청 일시</Label>
                <Input
                  value={data.transferCall}
                  readOnly
                  className="bg-white border-none shadow-sm"
                />
              </div>
              <div>
                <Label className="text-sm mb-1">이송 종료 일시</Label>
                <Input
                  value={data.transferArrive}
                  readOnly
                  className="bg-white border-none shadow-sm"
                />
              </div>
              <div>
                <Label className="text-sm mb-1">상황실 신고 일시</Label>
                <Input
                  value={data.controlCall}
                  readOnly
                  className="bg-white border-none shadow-sm"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HospitalDetailDialog;
