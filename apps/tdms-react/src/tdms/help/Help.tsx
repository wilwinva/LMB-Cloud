import React from 'react';
import { IStackStyles, Stack } from 'office-ui-fabric-react';
import { ToolTipLink, PurpleHeader, ContentBoxPurpleHeader } from '@nwm/uifabric';

const linkStyles: IStackStyles = {
  root: {
    selectors: {
      a: {
        color: 'green',
        fontWeight: 'bold',
      },
    },
  },
};
//todo: create these linked pages.
export default function Help() {
  return (
    <Stack styles={linkStyles}>
      <ContentBoxPurpleHeader title="Help!">
        <ToolTipLink to="#" toolTipContent="Create What is TDMS? page.">
          What is TDMS?
        </ToolTipLink>
        <ToolTipLink to="#" toolTipContent="Create What is a Parameter? page.">
          What is a Parameter?
        </ToolTipLink>
        <ToolTipLink to="#" toolTipContent="Create What is a DTN? page.">
          What is a DTN?
        </ToolTipLink>
      </ContentBoxPurpleHeader>
      <PurpleHeader title="The above links are to assist you in navigating the Tecnical Data Management System (TDMS) database applications." />
    </Stack>
  );
}
