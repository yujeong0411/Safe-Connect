export interface PublicHeaderProps {
  LinkLabel?: string;
  LinkHref?: string;
  userName?: string;
  labels?: {
    label: string;
    href: string;
    onClick?: () => void;
  }[];
}
