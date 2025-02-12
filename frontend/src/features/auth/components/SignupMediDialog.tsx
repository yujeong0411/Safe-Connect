import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {MediDialogProps} from "@features/auth/types/MediDialog.types.ts";

const SignupMediDialog =({ open, onOpenChange, onConfirm, onCancel }: MediDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-[400px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-sans">의료정보 입력</AlertDialogTitle>
                    <AlertDialogDescription className="text-base font-sans">
                        의료정보를 입력하시겠습니까?<br />
                        의료정보는 긴급상황 발생 시 119에 전달됩니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel} className="font-sans">
                        나중에 입력
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-banner hover:bg-banner font-sans">
                        지금 입력
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SignupMediDialog;