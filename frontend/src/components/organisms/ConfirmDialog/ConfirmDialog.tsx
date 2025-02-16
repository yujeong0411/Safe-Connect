import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {ConfirmDialogProps} from "@components/organisms/ConfirmDialog/ConfirmDialog.types.ts";

const ConfirmDialog = ({
                         trigger,
                         title = "정말로 진행하시겠습니까?",
                         description = "이 작업을 계속 진행할 수 없습니다.",
                         confirmText = "계속",
                         cancelText = "취소",
                         onConfirm,
                         onCancel,
                         triggerVariant = 'blue',
                         cancelVariant = 'outline',
                         confirmVariant = "destructive",
}: ConfirmDialogProps) => {


  return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {trigger || <Button variant={triggerVariant}>확인</Button>}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant={cancelVariant} onClick={onCancel}>
                {cancelText}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant={confirmVariant} onClick={onConfirm}>
                {confirmText}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
};
export default ConfirmDialog;
