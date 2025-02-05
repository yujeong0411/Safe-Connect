import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogProps } from '../types/dialog.types';

const VideoCallCreateDialog = ({ open, onOpenChange }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-8 bg-dialog_color">
        <h2 className="text-2xl font-bold mb-8">영상통화 생성</h2>
        
        <div className="space-y-6">
          <div>
            <p className="mb-2">신고자 전화번호</p>
            <Input 
              type="tel" 
              placeholder="010-0000-0000" 
              className="bg-white" 
            />
          </div>
          
          <div className="flex justify-between gap-4">
            <Button 
              className="flex-1 bg-[#545f71] hover:bg-[#697383] text-white py-6"
              onClick={() => {}}
            >
              영상통화방 생성 및 url전송
            </Button>
            <Button 
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-6"
              onClick={() => onOpenChange(false)}
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallCreateDialog;