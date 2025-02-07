import {DialogProps} from "@features/control/types/dialog.types.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';

const PreKtasDialog = ({open, onOpenChange}: DialogProps) => {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>AI 중증도 분류</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    {/* AI 분석 결과 표시 */}
                    <div className="space-y-4">
                        <p>분석된 KTAS 단계: [AI 결과]</p>
                        <p>판단 근거: [AI 설명]</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PreKtasDialog;
