import React from

export interface UserInfoHeaderProps {
  title: string;
  content: string;
  primaryButtonOnClick: () => void;
  secondaryButtonOnClick: () => void;
  secondaryButtonText: string;
  children: ReactNode;
}
