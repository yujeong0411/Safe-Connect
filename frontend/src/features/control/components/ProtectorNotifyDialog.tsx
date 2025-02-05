import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogProps } from '../types/dialog.types';

const ProtectorNotifyDialog = ({ open, onOpenChange }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-8 bg-bg">
        <h2 className="text-2xl font-bold mb-4">보호자 알림 전송</h2>
        
        <div className="space-y-6">
          <div>
            <p className="text-gray-600 mb-2">메세지</p>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p>[Safe Connect] 응급 신고 접수 알림</p>
              <p>[000]님의 119 신고가 접수되었습니다.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>신고 시각 : 2024.01.17 14:30</li>
                <li>신고 위치 : 광주광역시 광산구 장덕동 1442</li>
                <li>현재 상태 : 구급대원 출동 중</li>
              </ul>
              <p>*환자의 위치로 이동 중이신 경우, 안전운전 바랍니다.</p>
            </div>
          </div>

          <div>
            <p className="mb-2">보호자 연락처</p>
            <Input 
              type="tel" 
              placeholder="010-0000-0000" 
              className="bg-white mb-4" 
            />
          </div>

          <Button 
            className="w-full bg-[#545f71] hover:bg-[#697383] text-white py-6"
            onClick={() => {}}
          >
            전송
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProtectorNotifyDialog;