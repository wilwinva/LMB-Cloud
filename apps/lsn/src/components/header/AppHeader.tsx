import React from 'react';
import { HeaderProps } from '@nwm/uifabric';
import Header from './Header';
export interface AppHeaderProps extends HeaderProps {}

export default function AppHeader(props: AppHeaderProps) {
  return <Header />;
}
