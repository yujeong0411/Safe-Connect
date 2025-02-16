export interface ConfirmDialogProps {
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'blue'
    cancelVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'blue';
    confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'blue';
}
