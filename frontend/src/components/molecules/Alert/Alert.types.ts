export interface DialogProps {
  title: string;
  message?: string;
  sections?: {
    title: string;
    content: string[];
  }[];
  buttons: {
    text: string;
    variant: 'primary' | 'secondary';
    onClick: () => void;
  }[];
}
