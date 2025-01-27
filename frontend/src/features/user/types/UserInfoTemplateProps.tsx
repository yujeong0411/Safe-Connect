import React from 'react';

export interface UserInfoTemplateProps {
  title: string;
  content: string;
  logoSrc?: string;
  logoAlt?: string;
  primaryButtonOnClick: () => void;
  secondaryButtonOnClick: () => void;
  children: React.ReactNode;
}
