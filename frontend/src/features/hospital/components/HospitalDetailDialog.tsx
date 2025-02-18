import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PatientDetailProps } from '@features/hospital/types/patientDetail.types.ts';
import {useHospitalTransferStore} from "@/store/hospital/hospitalTransferStore.tsx";

const HospitalDetailDialog = ({ open, onOpenChange, data }: PatientDetailProps) => {
  const { updateTransferStatus} = useHospitalTransferStore();

  // 이송 신청 답변
  const handleTransferStatus = async (status:'ACCEPTED' | 'REJECTED') => {
    console.log('handleTransferStatus 호출됨', {
      patientId: data.patientId,
      status,
      fullData: data
    });

    if (!data?.patientId) {
        console.error('환자 ID가 없습니다');
        return
      }

    try {
      // 스토어 함수 호출
      await updateTransferStatus(data.patientId, status);   // 벡엔드 추가 후 수정

      onOpenChange(false);  // 답변 후 모달 닫기
    }catch(error) {
      console.error("모달 응답 실패", error);
    }
  }

  // data가 없으면 렌더링하지 않음
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] min-w-[800px] w-[80%] max-h-[90vh] min-h-[500px] overflow-y-auto p-8 bg-dialog_color">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">이송 상세정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* 첫 번째 줄 */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_2fr] gap-4">
            <div>
              <Label className="text-sm mb-1">이름</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.name}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">성별</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.gender}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">나이</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.age}</div>
            </div>
            <div>
              <Label className="text-sm mb-1 text-red-600">pre-KTAS</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.preKTAS}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">의식상태</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.mental}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">환자 연락처</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.phone}</div>
            </div>
          </div>

          {/* 두 번째 줄 */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_2fr] gap-4">
            <div>
              <Label className="text-sm mb-1">SBP</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.sbp}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">DBP</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.dbp}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">PR</Label>
              <div className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.pr}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">BT</Label>
              <div className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.bt}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">SPO2</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.spo2}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">BST</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.bst}</div>
            </div>
            <div>
              <Label className="text-sm mb-1">보호자 연락처</Label>
              <div
                  className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.protectorPhone}</div>
            </div>
          </div>

          {/* 세번째 줄 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-1">증상</Label>
                <div
                    className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.symptoms}</div>
              </div>
              <div>
                <Label className="text-sm mb-1">현재 병력</Label>
                <div
                    className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.diseases}</div>
              </div>
              <div>
                <Label className="text-sm mb-1">복용 약물</Label>
                <div
                    className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.medications}</div>
              </div>
            </div>

            <div>
              <Label className="text-sm mb-1">첨부 사진</Label>
              <div
                  className="bg-dialog_content h-[222px] rounded-md shadow-sm flex items-center justify-center text-gray-400">
                이미지 사진
              </div>
            </div>
          </div>

          {/* 하단 시간 정보와 버튼 */}
          <div className="flex justify-between">
            <div className="grid grid-cols-4 gap-4 flex-grow">
              <div>
                <Label className="text-sm mb-1">이송 요청 일시</Label>
                <div
                    className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.requestTransferAt}</div>
              </div>
              <div>
                <Label className="text-sm mb-1">이송 수락 일시</Label>
                <div
                    className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.transferAcceptAt}</div>
              </div>
              <div>
                <Label className="text-sm mb-1">이송 종료 일시</Label>
                <div
                    className="p-2.5 bg-dialog_content rounded-lg min-h-[48px] text-sm flex items-center">{data.transferArriveAt}</div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 ml-5 h-10">
              {!data?.transferAcceptAt ? (   // 수락시간이 있으면 이미 수락된 상태
                  <>
                    <Button onClick={() => handleTransferStatus('ACCEPTED')} variant="destructive" className=" hover:bg-red-400" size="default">
                      수락
                    </Button>
                    <Button onClick={() => handleTransferStatus('REJECTED')} className="bg-graybtn hover:bg-neutral-300 text-black" size="default">
                      거절
                    </Button>
                  </>
              ) : (
                  <Button onClick={() => onOpenChange(false)} className="bg-banner hover:bg-neutral-300" size="default">
                    닫기
                  </Button>
              )}
            </div>
          </div>
          </div>

      </DialogContent>
    </Dialog>
);
};

export default HospitalDetailDialog;
