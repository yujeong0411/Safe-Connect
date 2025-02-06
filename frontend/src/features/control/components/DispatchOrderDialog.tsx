// 두 번 클릭하는 것이 번거로운 업무라는 피드백 반영
// Alert 창으로 대체

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogProps } from '../types/dialog.types';

const DispatchOrderDialog = ({ open, onOpenChange }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-8 bg-dialog_color">
        <h2 className="text-2xl font-bold mb-6">출동 지령</h2>
        
        <div className="space-y-6">
          <div>
            <p className="font-medium mb-2">신고 내용</p>
            <div className="bg-dialog_content p-4 rounded-md space-y-2">
              <p>출동 소방서 : 광산구 소방서 3팀</p>
              <p>출동 위치 : 광주광역시 광산구 장덕동 1234</p>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">요약본</p>
            <div className="bg-dialog_content p-4 rounded-md">
              <p>갑작스러운 심합 복통, 구토</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-6"
              onClick={() => {}}
            >
              출동 지령
            </Button>
            <Button 
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-6"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchOrderDialog;