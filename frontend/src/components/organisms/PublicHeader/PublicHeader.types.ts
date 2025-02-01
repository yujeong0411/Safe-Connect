export interface PublicHeaderProps {
  LinkLabel?: string;
  LinkHref?: string;
  labels?: {
    label: string;
    href: string;
    onClick?: () => void;
  }[];
}
