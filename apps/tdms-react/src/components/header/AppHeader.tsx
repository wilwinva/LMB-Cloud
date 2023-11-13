import React from 'react';
import { Comments, Header, HeaderProps, useCustomizations } from '@nwm/uifabric';
import Databases from '../Databases';
import { IPalette } from '@uifabric/styling';
import Maint from '../maint/Maint';
import { Contacts } from '../contacts/contacts';

//todo -- find way to ensure these routes are added when a AppHeader is used
export const APP_HEADER_ROUTE_CONFIG = {
  comments: { path: 'comments', element: <Comments />, linkText: 'Comments', parameters: {} },
  contacts: { path: 'contacts', element: <Contacts />, linkText: 'Contacts', parameters: {} },
  databases: { path: 'databases', element: <Databases />, linkText: 'Databases', parameters: {} },
  maint: { path: 'maint', element: <Maint />, linkText: 'Maint', parameters: {} },
};

export interface AppHeaderProps extends HeaderProps {}

export default function AppHeader(props: AppHeaderProps) {
  const settings = useCustomizations().settings.extended;
  const palette: Partial<IPalette> = settings!.palette;
  return <Header {...props} title={{ text: 'Technical Data Management Systems', color: palette.themeSecondary }} />;
}
