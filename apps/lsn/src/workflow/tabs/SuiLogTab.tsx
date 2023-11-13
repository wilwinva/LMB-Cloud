import React, { useState } from 'react';

import { ChoiceGroup, IChoiceGroupOption, Stack, Text, Separator } from 'office-ui-fabric-react';

import SUILogTabSection from './components/SUILogTabSection';

import { getSUILogTabStyles } from './TabStyles';

import { WorkflowDocumentFragment } from '@nwm/lsn/src/workflow/__generated__/WorkflowDocumentFragment';

export interface SuiLogTabProps {
  document: WorkflowDocumentFragment | undefined;
}

const options: IChoiceGroupOption[] = [
  { key: 'YES', text: 'Yes' },
  { key: 'NO', text: 'No', styles: { root: { marginLeft: 14 } } },
];

export function SuiLogTab(props: SuiLogTabProps) {
  const doc = props.document;
  const radioValue = props.document?.edit_field2?.trim(); // YES or NO
  const { tabContent, radioRoot } = getSUILogTabStyles(false);

  return (
    <Stack className={tabContent}>
      <Text variant={'xLarge'}>Sensitive Unclassified Information Log</Text>
      <Separator />
      <SUILogTabSection
        headerText="A description of the subject matter of the document without revealing
                the sensitive unclassified information"
        defaultValue={doc?.result3}
      />
      <SUILogTabSection
        headerText="A justification, without revealing the sensitive unclassified information, that the information
                qualifies as sensitive unclassified information"
        defaultValue={doc?.result3_tag}
      />
      <Text variant="large">
        Is this document being maintained under procedures or pratices that preserve the protection of the document
      </Text>
      <ChoiceGroup defaultSelectedKey={radioValue} options={options} className={radioRoot} />
      <Separator />

      <SUILogTabSection
        headerText="List any known exceptions including whether the document was previously publicly available"
        defaultValue={doc?.edit_field}
      />
    </Stack>
  );
}

export default SuiLogTab;
