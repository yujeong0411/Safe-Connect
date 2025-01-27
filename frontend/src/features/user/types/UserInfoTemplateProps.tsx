import React from 'react';

export interface UserInfoHeaderProps {
  title: string;
  content: string;
  primaryButtonOnClick: () => void;
  secondaryButtonOnClick: () => void;
  primaryButtonText: string;
  secondaryButtonText: string;
  children: React.ReactNode;
}
