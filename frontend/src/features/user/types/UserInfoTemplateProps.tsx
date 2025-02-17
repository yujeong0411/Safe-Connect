import React from 'react';

export interface UserInfoTemplateProps {
  title: string;
  content: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
  primaryButtonOnClick: () => void;
  secondaryButtonOnClick?: () => void;
  children: React.ReactNode;
}
