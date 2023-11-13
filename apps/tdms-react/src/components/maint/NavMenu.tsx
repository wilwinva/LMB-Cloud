import React from 'react';
import { INavLinkGroup, Nav } from 'office-ui-fabric-react';

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        name: 'Super User Menu',
        url: '',
        isExpanded: true,
        links: [
          { name: 'Contacts Add/Update', url: '' },
          { name: 'Data Set Delete', url: '' },
        ],
      },
      {
        name: 'Data Coordinator',
        url: '',
        isExpanded: true,
        links: [
          { name: 'Data Set Add/Update', url: '' },
          { name: 'Change History Add/Update', url: '' },
        ],
      },
      {
        name: 'Administrator',
        url: '',
        isExpanded: true,
        links: [
          { name: 'TDIF QC/Un-QC', url: '' },
          { name: 'Submittal Data Add/Update', url: '' },
          { name: 'Package IDs Add/Update', url: '' },
        ],
      },
      {
        name: 'DTN Issue Tracker',
        url: '',
        isExpanded: true,
        links: [
          { name: 'Issues Add/Update', url: '' },
          { name: 'DTN - Issues Link', url: '' },
        ],
      },
      {
        name: 'Components',
        url: '',
        isExpanded: true,
        links: [
          { name: 'GIS Update/Add', url: '' },
          { name: 'SEP Update/Add', url: '' },
          { name: 'Models Update/Add', url: '' },
        ],
      },
      {
        name: 'Tech Data Parameters',
        url: '',
        isExpanded: true,
        links: [
          { name: 'Parameters Add/Update', url: '' },
          { name: 'Alias Set Delete', url: '' },
          { name: 'Attributes Update/Add', url: '' },
        ],
      },
      {
        name: 'TDMS Files',
        url: '',
        isExpanded: true,
        links: [{ name: 'TDMS Files Add/Update', url: '' }],
      },
      {
        name: 'ATDT Manager',
        url: '',
        isExpanded: true,
        links: [
          { name: 'View Comments', url: '' },
          { name: 'RPC Sub Def Report', url: '' },
          { name: 'People Add/Update', url: '' },
          { name: 'Organizations Add/Update', url: '' },
        ],
      },
      {
        name: 'GENISES Tracking System',
        url: '',
      },
    ],
  },
];

export interface NavMenuProps {}

export default function NavMenu(props: NavMenuProps) {
  return <Nav ariaLabel="TDMS navigation panel" groups={navLinkGroups} />;
}
