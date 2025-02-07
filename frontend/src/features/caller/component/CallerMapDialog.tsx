import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogProps } from '@features/caller/types/dialog.types.ts';

const CallerMapDialog = ({ open, onOpenChange }: DialogProps) => {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-8 bg-bg">
        <DialogTitle className="text-2xl font-bold mb-8">
          지도
        </DialogTitle>

        <div className="space-y-6">
          <div>
            <DialogDescription className="mb-2">
              지도가 들어갈 예정...
            </DialogDescription>
          </div>
          <div className="flex justify-between gap-4">
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

export default CallerMapDialog;