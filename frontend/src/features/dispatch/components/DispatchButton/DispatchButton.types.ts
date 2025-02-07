export interface DispatchButtonProps {
    variant?: 'blue' | 'gray' | 'red';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    width?: 'full' | 'half' | 'quarter' | 'sm' | 'auto';
    children?: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
  }
  