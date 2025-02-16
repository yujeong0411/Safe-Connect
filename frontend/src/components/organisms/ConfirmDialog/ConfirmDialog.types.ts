export interface ConfirmDialogProps {
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gray' | 'banner'
    cancelVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gray' | 'banner'
    confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gray' | 'banner'
    className?: string;
}
