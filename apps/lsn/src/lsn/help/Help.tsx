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
        <ToolTipLink to="#" toolTipContent="What is a workflow.">
          What is a workflow?
        </ToolTipLink>
      </ContentBoxPurpleHeader>
      <PurpleHeader title="The above links are to assist the user" />
    </Stack>
  );
}
