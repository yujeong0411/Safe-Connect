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
import { ConfirmDialogProps } from '@components/organisms/ConfirmDialog/ConfirmDialog.types.ts';

const ConfirmDialog = ({
  trigger,
  title = '정말로 진행하시겠습니까?',
  description = '이 작업을 계속 진행할 수 없습니다.',
  confirmText = '계속',
  cancelText = '취소',
  onConfirm,
  onCancel,
  triggerVariant = 'default',
  cancelVariant = 'outline',
  confirmVariant = 'destructive',
  className,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
          variant={triggerVariant}
          className={className}
      >
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant={cancelVariant} onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ConfirmDialog;
